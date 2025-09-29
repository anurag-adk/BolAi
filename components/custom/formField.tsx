/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";

const FormField = ({
  control,
  name,
  label,
  placeholder,
  type = "text",
}: any) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <FormItem>
        <FormLabel className="text-gray-300 font-medium">{label}</FormLabel>
        <FormControl>
          <Input
            placeholder={placeholder}
            {...field}
            type={type}
            className={`h-12 px-4 bg-white/5 border rounded-lg text-white placeholder:text-gray-500 focus:outline-none hover:border-white/30 transition-all duration-200 focus:bg-white/10 ${
              fieldState.error
                ? "border-red-400 focus:border-red-400"
                : "border-white/20 focus:border-green-500"
            }`}
          />
        </FormControl>
        <FormMessage className="text-red-400 text-sm mt-1 font-medium" />
      </FormItem>
    )}
  />
);

export default FormField;
