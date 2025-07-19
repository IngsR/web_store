'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';

const format = (value: number) => {
    return new Intl.NumberFormat('id-ID').format(value);
};

const parse = (value: string) => {
    return Number(value.replace(/[^0-9]/g, ''));
};

interface CurrencyInputProps
    extends Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        'onChange' | 'value' | 'type'
    > {
    value: number | null | undefined;
    onValueChange: (value: number | undefined) => void;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
    ({ value, onValueChange, ...props }, ref) => {
        const [displayValue, setDisplayValue] = React.useState(
            value ? format(value) : '',
        );

        React.useEffect(() => {
            setDisplayValue(value ? format(value) : '');
        }, [value]);

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const { value: inputValue } = event.target;
            const parsedValue = parse(inputValue);

            if (!isNaN(parsedValue)) {
                setDisplayValue(format(parsedValue));
                onValueChange(parsedValue);
            } else if (inputValue === '') {
                setDisplayValue('');
                onValueChange(undefined);
            }
        };

        return (
            <Input
                {...props}
                ref={ref}
                value={displayValue}
                onChange={handleChange}
                type="text"
                inputMode="numeric"
            />
        );
    },
);
CurrencyInput.displayName = 'CurrencyInput';

export { CurrencyInput };
