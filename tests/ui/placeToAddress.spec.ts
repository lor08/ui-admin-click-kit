import { describe, expect, it } from 'vitest';
import { placeToAddress } from '../../src/ui/map';

const component = (long_name: string, types: string[], short_name = long_name) => ({ long_name, short_name, types });

/** A Google place read into the fields of a US address form. */
describe('placeToAddress', () => {
    it('makes the street of the number and the route, the unit its second line, the state its code, the zip five digits', () => {
        expect(
            placeToAddress([
                component('4B', ['subpremise']),
                component('12', ['street_number']),
                component('Elm Street', ['route']),
                component('Springfield', ['locality', 'political']),
                component('San Mateo County', ['administrative_area_level_2']),
                component('Illinois', ['administrative_area_level_1'], 'IL'),
                component('62704-1234', ['postal_code']),
            ]),
        ).toEqual({ line1: '12 Elm Street', line2: '4B', city: 'Springfield', state: 'IL', zip: '62704' });
    });

    it('takes the city from where Google put it when there is no locality', () => {
        expect(placeToAddress([component('Route 9', ['route']), component('Elmwood', ['neighborhood']), component('Lake County', ['administrative_area_level_2'])])).toEqual({ line1: 'Route 9', line2: '', city: 'Elmwood', state: '', zip: '' });
        expect(placeToAddress([component('Lake County', ['administrative_area_level_2'])]).city).toBe('Lake County');
    });
});
