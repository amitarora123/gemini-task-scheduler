import React from 'react'
import {FormControl, FormItem as ShadFormItem, FormLabel, FormMessage, FormField } from "./ui/form";
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Input } from './ui/input';

interface FormItemProps<T extends FieldValues> {
    type: string;
    name: FieldPath<T>;
    control: Control<T>;
    label: string;
    placeholder: string;
}

const FormItem = <T extends FieldValues>({control, name, type, placeholder, label}: FormItemProps<T>) => {
  return (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
        <ShadFormItem>
            <FormLabel className="text-primary-orange">{label}</FormLabel>
            <FormControl>
            <Input type={type} placeholder={placeholder} {...field} />
            </FormControl>
            <FormMessage />
        </ShadFormItem>
        )}
    />
  )
}

export default FormItem