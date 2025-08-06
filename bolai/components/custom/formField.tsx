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
    render={({ field }) => (
      <FormItem>
        <FormLabel className="md:text-lg lg:text-sm">{label}</FormLabel>
        <FormControl>
          <Input
            placeholder={placeholder}
            {...field}
            type={type}
            className="h-[7.5vh] md:h-[6.75vh] lg:h-[6.5vh] px-4 focus:outline-none focus:ring-2 focus:ring-green-500 !ring-green-400/90 my-2 placeholder:text-base md:placeholder:text-lg lg:placeholder:text-sm"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default FormField;
