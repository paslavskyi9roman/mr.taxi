import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MtButtonComponent } from '../../shared/components/mt-button/mt-button.component';
import { AddTariffDialogComponent } from './add-tariff-dialog/add-tariff-dialog.component';
import { EditTariffDialogComponent } from './edit-tariff-dialog/edit-tariff-dialog.component';
import { TariffService } from './tariff.service';
import { Tariff } from './tariff.model';
import { Observable, startWith, map } from 'rxjs';

@Component({
  selector: 'app-tariffs',
  templateUrl: './tariffs.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MtButtonComponent
  ],
  styleUrls: ['./tariffs.component.scss']
})
export class TariffsComponent implements OnInit {
  private tariffService: TariffService = inject(TariffService);
  private dialog: MatDialog = inject(MatDialog);
  private listOfCities: Set<string> = new Set();

  public tariffs$: Observable<Tariff[]> = this.tariffService.getTariffs();
  public filteredTariffs: Tariff[] = [];
  public cityControl = new FormControl();
  public filteredCities: string[] = [];

  ngOnInit(): void {
    this.initializeTariffs();
    this.initializeCityFilter();
  }

  private initializeTariffs(): void {
    this.tariffs$ = this.tariffService.getTariffs();
    this.tariffs$.subscribe((tariffs) => {
      this.filteredTariffs = tariffs;
      this.updateCitiesList(tariffs);
    });
  }

  private initializeCityFilter(): void {
    this.cityControl.valueChanges
      .pipe(
        startWith(''),
        map((value) => this.filterCities(value))
      )
      .subscribe((filtered) => (this.filteredCities = filtered));
  }

  private updateCitiesList(tariffs: Tariff[]): void {
    this.listOfCities.clear();
    tariffs.forEach((tariff) => {
      this.listOfCities.add(tariff.route.from);
      this.listOfCities.add(tariff.route.to);
      tariff.additionalStops.forEach((stop) => {
        this.listOfCities.add(stop.from);
        this.listOfCities.add(stop.to);
      });
    });
    this.filteredCities = Array.from(this.listOfCities);
  }

  private filterCities(value: string): string[] {
    const filterValue = value.toLowerCase();
    return Array.from(this.listOfCities).filter((city) => city.toLowerCase().includes(filterValue));
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    const filter = filterValue.toLowerCase();
    this.tariffs$.subscribe((tariffs) => {
      this.filteredTariffs = tariffs.filter(
        (tariff) =>
          tariff.route.from.toLowerCase().includes(filter) ||
          tariff.route.to.toLowerCase().includes(filter) ||
          tariff.additionalStops.some(
            (stop) =>
              stop.from.toLowerCase().includes(filter) || stop.to.toLowerCase().includes(filter)
          )
      );
    });
  }

  public addTariff(): void {
    const dialogRef = this.dialog.open(AddTariffDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result): void => {
      if (result) {
        this.tariffService.addTariff(result);
      }
    });
  }

  public editTariff(tariff: Tariff): void {
    const dialogRef = this.dialog.open(EditTariffDialogComponent, {
      width: '500px',
      data: tariff
    });

    dialogRef.afterClosed().subscribe((result): void => {
      if (result) {
        this.tariffService.updateTariff(result);
      }
    });
  }
}
