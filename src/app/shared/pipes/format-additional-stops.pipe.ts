import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatAdditionalStops'
})
export class FormatAdditionalStopsPipe implements PipeTransform {
  transform(stops: { from: string }[]): string {
    return stops.map((stop, index) => `Stop ${index + 1}: ${stop.from}`).join('\n');
  }
}
