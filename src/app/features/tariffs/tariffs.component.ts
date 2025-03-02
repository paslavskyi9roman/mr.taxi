import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { mockTariffs, Tariff } from './mock-tariffs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MtButtonComponent } from '../../shared/components/mt-button/mt-button.component';
import { AddTariffDialogComponent } from './add-tariff-dialog/add-tariff-dialog.component';

@Component({
  selector: 'app-tariffs',
  templateUrl: './tariffs.component.html',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatIconModule, MtButtonComponent],
  styleUrls: ['./tariffs.component.scss']
})
export class TariffsComponent {
  public tariffs: Tariff[] = mockTariffs;
  public filteredTariffs: Tariff[] = mockTariffs;

  constructor(private dialog: MatDialog) {}

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    const filter = filterValue.toLowerCase();
    this.filteredTariffs = this.tariffs.filter(
      (tariff) =>
        tariff.route.from.toLowerCase().includes(filter) ||
        tariff.route.to.toLowerCase().includes(filter) ||
        tariff.additionalStops.some(
          (stop) =>
            stop.from.toLowerCase().includes(filter) || stop.to.toLowerCase().includes(filter)
        )
    );
  }

  public addTariff(): void {
    const dialogRef = this.dialog.open(AddTariffDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result): void => {
      if (result) {
        this.tariffs.push(result);
        this.filteredTariffs = [...this.tariffs];
      }
    });
  }
}
