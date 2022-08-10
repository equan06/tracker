import { render, screen } from '@testing-library/react';
import {getStartEndOfWk} from './DateUtils';

// todo refactor test suites
test('date works correctly', () => {
    let [start, end] = getStartEndOfWk("2022-09-30");
    expect(start).toBe("2022-09-26");
    expect(end).toBe("2022-10-02");
})