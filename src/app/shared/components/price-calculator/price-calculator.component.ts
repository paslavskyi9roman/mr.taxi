import { Component, OnInit, inject, ViewChild, ElementRef, NgZone, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { TariffService } from '../../../features/tariffs/tariff.service';
import { environment } from '../../../../environment/environment';

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

@Component({
  selector: 'app-price-calculator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    TranslatePipe
  ],
  templateUrl: './price-calculator.component.html',
  styleUrls: ['./price-calculator.component.scss']
})
export class PriceCalculatorComponent implements OnInit {
  @ViewChild('fromContainer') fromContainer!: ElementRef;
  @ViewChild('toContainer') toContainer!: ElementRef;

  private tariffService = inject(TariffService);
  private ngZone = inject(NgZone);
  private platformId = inject(PLATFORM_ID);
  private translate = inject(TranslateService);
  
  public calculatorForm: FormGroup;
  public meterPrice: number | null = null;
  public fixedPrice: number | null = null;
  public savings: number | null = null;
  public distance: number | null = null;
  public duration: number | null = null;
  public isCalculating = false;
  public errorMessage: string | null = null;
  public fromLocation: string = '';
  public toLocation: string = '';
  public phoneNumber = environment.driversPhoneNumber;

  // Taxi meter pricing (standard rates in Netherlands)
  private readonly pricePerKm = 2.35;
  private readonly pricePerMinute = 0.42;
  private readonly startingPrice = 3.19;

  /** Show competitors' price this much higher so our price looks better (e.g. 5%) */
  private readonly competitorPriceMarkupPercent = 5;

  // Google Maps autocomplete elements
  private fromAutocompleteEl: any;
  private toAutocompleteEl: any;

  /** Debounce timer for input sync */
  private inputDebounceTimers: Record<string, ReturnType<typeof setTimeout>> = {};

  /** Routes cache: in-memory + localStorage (1 hour TTL, max 100 entries) */
  private static routesCache = new Map<string, { distance: number; duration: number }>();
  private static readonly CACHE_MAX_ENTRIES = 100;
  private static readonly LOCAL_CACHE_KEY = 'mrtaxi_routes_cache';
  private static readonly LOCAL_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

  constructor(private fb: FormBuilder) {
    this.calculatorForm = this.fb.group({
      from: ['', [Validators.required, Validators.minLength(2)]],
      to: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadGoogleMapsScript();
    }
  }

  private loadGoogleMapsScript(): void {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      this.initAutocomplete();
      return;
    }

    const mapsKey = environment.firebaseConfig?.apiKey ?? '';
    if (!mapsKey) {
      console.warn('Google Maps API key not configured. Using fallback estimation.');
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${mapsKey}&libraries=places&loading=async&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    script.onerror = () => {
      console.error('Failed to load Google Maps. Using fallback estimation.');
    };
    
    window.initMap = () => {
      this.ngZone.run(() => {
        setTimeout(() => this.initAutocomplete(), 100);
      });
    };
    
    document.head.appendChild(script);
  }

  private initAutocomplete(): void {
    if (!window.google || !window.google.maps) {
      console.warn('Google Maps not loaded');
      return;
    }

    try {
      // Check if PlaceAutocompleteElement is available (requires Places API (New))
      if (!window.google.maps.places?.PlaceAutocompleteElement) {
        console.warn(
          'PlaceAutocompleteElement not available. ' +
          'Enable "Places API (New)" in Google Cloud Console.'
        );
        return;
      }

      // Focus on Netherlands
      const netherlandsBounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(50.75, 3.36), // Southwest Netherlands
        new window.google.maps.LatLng(53.55, 7.23)  // Northeast Netherlands
      );

      const options = {
        includedRegionCodes: ['nl'],
        locationBias: netherlandsBounds,
      };

      // Wait for ViewChild containers to be available
      setTimeout(() => {
        this.setupAutocompleteElement(
          'from',
          this.fromContainer,
          options,
          this.translate.instant('CALCULATOR.FROM_PLACEHOLDER') || 'Enter pickup address'
        );

        this.setupAutocompleteElement(
          'to',
          this.toContainer,
          options,
          this.translate.instant('CALCULATOR.TO_PLACEHOLDER') || 'Enter destination'
        );
      }, 300);
    } catch (error) {
      console.error('Error initializing autocomplete:', error);
    }
  }

  private setupAutocompleteElement(
    formField: 'from' | 'to',
    container: ElementRef | undefined,
    options: any,
    placeholder: string
  ): void {
    if (!container?.nativeElement) return;

    const el = new window.google.maps.places.PlaceAutocompleteElement(options);
    el.placeholder = placeholder;

    // On place selection from the dropdown
    el.addEventListener('gmp-select', (e: any) => {
      this.ngZone.run(() => {
        const address = e.placePrediction?.text?.text || '';
        this.calculatorForm.patchValue({ [formField]: address });
      });
    });

    // Sync typed text to the reactive form with debounce (300 ms)
    el.addEventListener('input', () => {
      clearTimeout(this.inputDebounceTimers[formField]);
      this.inputDebounceTimers[formField] = setTimeout(() => {
        this.ngZone.run(() => {
          this.calculatorForm.patchValue(
            { [formField]: el.value || '' },
            { emitEvent: false }
          );
        });
      }, 300);
    });

    container.nativeElement.appendChild(el);

    if (formField === 'from') {
      this.fromAutocompleteEl = el;
    } else {
      this.toAutocompleteEl = el;
    }
  }

  public get canCalculate(): boolean {
    const from = (this.calculatorForm.get('from')?.value || this.fromAutocompleteEl?.value || '').trim();
    const to = (this.calculatorForm.get('to')?.value || this.toAutocompleteEl?.value || '').trim();
    return from.length >= 2 && to.length >= 2 && !this.isCalculating;
  }

  public async calculatePrice(): Promise<void> {
    this.isCalculating = true;
    this.errorMessage = null;
    
    const from = (this.calculatorForm.get('from')?.value || this.fromAutocompleteEl?.value || '').trim();
    const to = (this.calculatorForm.get('to')?.value || this.toAutocompleteEl?.value || '').trim();

    if (from.length < 2 || to.length < 2) {
      this.isCalculating = false;
      return;
    }
    
    this.fromLocation = from;
    this.toLocation = to;

    try {
      // Step 1: Try to find fixed price for this route in tariffs (as before)
      const tariff = await this.findMatchingTariff(from, to);

      // Step 2: Calculate distance/duration (Google Maps or fallback)
      const routeCalculated = await this.calculateRouteWithGoogleMaps(from, to);
      if (!routeCalculated) {
        await this.estimateRoute(from, to);
      }

      // Step 3: Calculate prices
      if (this.distance && this.duration) {
        const realMeterPrice =
          this.startingPrice +
          (this.distance * this.pricePerKm) +
          (this.duration * this.pricePerMinute);

        const markup = this.competitorPriceMarkupPercent / 100;

        if (tariff) {
          // Fixed tariff: show real meter price, add markup only if meter is cheaper than us
          this.fixedPrice = tariff.price;
          this.meterPrice = realMeterPrice < tariff.price
            ? Math.round(tariff.price * (1 + markup) * 100) / 100
            : Math.round(realMeterPrice * 100) / 100;
        } else {
          // No tariff: our price = real meter, competitors = meter + markup
          this.fixedPrice = Math.round(realMeterPrice * 100) / 100;
          this.meterPrice = Math.round(realMeterPrice * (1 + markup) * 100) / 100;
        }

        this.savings = Math.round((this.meterPrice - this.fixedPrice!) * 100) / 100;
      }
    } catch (error) {
      this.errorMessage = 'Could not calculate route. Please check your addresses.';
      console.error('Calculation error:', error);
    } finally {
      this.isCalculating = false;
    }
  }

  private cacheKey(from: string, to: string): string {
    const a = from.toLowerCase().trim();
    const b = to.toLowerCase().trim();
    return a < b ? `${a}|${b}` : `${b}|${a}`;
  }

  private getCachedRoute(from: string, to: string): { distance: number; duration: number } | null {
    const key = this.cacheKey(from, to);
    const mem = PriceCalculatorComponent.routesCache.get(key);
    if (mem) return mem;
    if (typeof localStorage === 'undefined') return null;
    try {
      const raw = localStorage.getItem(PriceCalculatorComponent.LOCAL_CACHE_KEY);
      if (!raw) return null;
      const data: { key: string; distance: number; duration: number; ts: number }[] = JSON.parse(raw);
      const now = Date.now();
      const entry = data.find(e => e.key === key && now - e.ts < PriceCalculatorComponent.LOCAL_CACHE_TTL_MS);
      if (entry) return { distance: entry.distance, duration: entry.duration };
    } catch {
      // ignore
    }
    return null;
  }

  private setCachedRoute(from: string, to: string, distance: number, duration: number): void {
    const key = this.cacheKey(from, to);
    const map = PriceCalculatorComponent.routesCache;
    if (map.size >= PriceCalculatorComponent.CACHE_MAX_ENTRIES) {
      const first = map.keys().next().value;
      if (first) map.delete(first);
    }
    map.set(key, { distance, duration });
    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(PriceCalculatorComponent.LOCAL_CACHE_KEY);
        const data: { key: string; distance: number; duration: number; ts: number }[] = raw ? JSON.parse(raw) : [];
        const now = Date.now();
        data.push({ key, distance, duration, ts: now });
        const trimmed = data
          .filter(e => now - e.ts < PriceCalculatorComponent.LOCAL_CACHE_TTL_MS)
          .slice(-PriceCalculatorComponent.CACHE_MAX_ENTRIES);
        localStorage.setItem(PriceCalculatorComponent.LOCAL_CACHE_KEY, JSON.stringify(trimmed));
      } catch {
        // ignore
      }
    }
  }

  private async calculateRouteWithGoogleMaps(from: string, to: string): Promise<boolean> {
    const cached = this.getCachedRoute(from, to);
    if (cached) {
      this.distance = cached.distance;
      this.duration = cached.duration;
      return true;
    }

    const apiKey = environment.firebaseConfig?.apiKey;
    if (!apiKey) return false;

    try {
      // Call Routes API directly (no legacy DirectionsService needed)
      const response = await fetch(
        'https://routes.googleapis.com/directions/v2:computeRoutes',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration',
          },
          body: JSON.stringify({
            origin: { address: from },
            destination: { address: to },
            travelMode: 'DRIVE',
            routingPreference: 'TRAFFIC_AWARE',
          }),
        }
      );

      if (!response.ok) {
        console.warn('Routes API error:', response.status, await response.text());
        return false;
      }

      const data = await response.json();
      const route = data.routes?.[0];

      if (route) {
        this.distance = Math.round((route.distanceMeters / 1000) * 10) / 10;
        // duration comes as "123s" string
        const durationSec = parseInt(route.duration?.replace('s', '') || '0', 10);
        this.duration = Math.round(durationSec / 60);
        this.setCachedRoute(from, to, this.distance!, this.duration!);
        return true;
      }

      return false;
    } catch (err) {
      console.warn('Routes API call failed:', err);
      return false;
    }
  }

  private async findMatchingTariff(from: string, to: string): Promise<any> {
    return new Promise((resolve) => {
      this.tariffService.getTariffs().subscribe((tariffs) => {
        const inputFrom = from.toLowerCase();
        const inputTo = to.toLowerCase();

        const match = tariffs.find(t => {
          const routes = [t.route, ...t.additionalStops];

          return routes.some(r => {
            const routeFrom = r.from.toLowerCase().trim();
            const routeTo = r.to.toLowerCase().trim();

            return (
              (inputFrom.includes(routeFrom) && inputTo.includes(routeTo)) ||
              (inputFrom.includes(routeTo) && inputTo.includes(routeFrom))
            );
          });
        });

        resolve(match);
      });
    });
  }

  private async estimateRoute(from: string, to: string): Promise<void> {
    // Smart estimation based on common routes around Zoetermeer
    // When Google API is added, this becomes automatic and accurate
    
    const estimates: Record<string, { distance: number; duration: number }> = {
      // Major airports
      'schiphol': { distance: 55, duration: 40 },
      'amsterdam': { distance: 55, duration: 40 },
      'rotterdam': { distance: 25, duration: 25 },
      'rotterdam airport': { distance: 25, duration: 25 },
      'eindhoven': { distance: 110, duration: 75 },
      'eindhoven airport': { distance: 110, duration: 75 },
      
      // Nearby cities (Haaglanden region)
      'den haag': { distance: 15, duration: 20 },
      'hague': { distance: 15, duration: 20 },
      'delft': { distance: 10, duration: 15 },
      'leiden': { distance: 25, duration: 25 },
      'rijswijk': { distance: 12, duration: 18 },
      'voorburg': { distance: 8, duration: 12 },
      'wassenaar': { distance: 18, duration: 22 },
      'leidschendam': { distance: 10, duration: 15 },
      'pijnacker': { distance: 8, duration: 12 },
      
      // International (Belgium/Germany)
      'brussels': { distance: 180, duration: 120 },
      'antwerp': { distance: 130, duration: 90 },
      'düsseldorf': { distance: 230, duration: 150 },
      'dusseldorf': { distance: 230, duration: 150 }
    };

    const combined = `${from} ${to}`.toLowerCase();
    let found = false;

    // Try to match destination first
    for (const [key, value] of Object.entries(estimates)) {
      if (combined.includes(key)) {
        this.distance = value.distance;
        this.duration = value.duration;
        found = true;
        break;
      }
    }

    // Default estimation for unknown routes (average regional trip)
    if (!found) {
      this.distance = 35; // 35 km default
      this.duration = 30; // 30 min default
    }
  }

  public getWhatsAppLink(): string {
    const message = `Hi! I'd like a taxi from ${this.fromLocation} to ${this.toLocation}. Can you confirm the price?`;
    return `https://wa.me/${this.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
  }

  public getEmailLink(): string {
    const subject = 'Taxi Booking Request';
    const body = `Hello,\n\nI would like to book a taxi:\n\nFrom: ${this.fromLocation}\nTo: ${this.toLocation}\n\nPlease confirm availability and final price.\n\nThank you!`;
    return `mailto:info@mrtaxi.nl?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  public resetCalculator(): void {
    this.calculatorForm.reset();
    if (this.fromAutocompleteEl) this.fromAutocompleteEl.value = '';
    if (this.toAutocompleteEl) this.toAutocompleteEl.value = '';
    this.meterPrice = null;
    this.fixedPrice = null;
    this.savings = null;
    this.distance = null;
    this.duration = null;
    this.errorMessage = null;
    this.fromLocation = '';
    this.toLocation = '';
  }
}

