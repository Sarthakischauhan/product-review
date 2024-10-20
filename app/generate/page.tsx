"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const interestFields = [
  { id: "ui", label: "UI/UX" },
  { id: "functionality", label: "Functionality" },
  { id: "performance", label: "Performance" },
  { id: "security", label: "Security" },
  { id: "accessibility", label: "Accessibility" },
]

const formSchema = z.object({
  productName: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  productField: z.string().min(2, {
    message: "Product field must be at least 2 characters.",
  }),
  interestFields: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  reviewType: z.enum(["images", "livePreview"], {
    required_error: "Please select a review type.",
  }),
  screenCount: z.string().optional(),
  files: z.any().optional(),
  livePreviewLink: z.string().url().optional(),
}).refine((data) => {
  if (data.reviewType === "images") {
    return !!data.screenCount && !!data.files && 
           data.files.length > 0 && data.files.length <= 5 && 
           Array.from(data.files).every((file) => file.type.startsWith("image/"));
  } else if (data.reviewType === "livePreview") {
    return !!data.livePreviewLink;
  }
  return false;
}, {
  message: "Please provide the required information for the selected review type.",
  path: ["reviewType"],
});

const Page = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      productField: "",
      interestFields: [],
      screenCount: "",
      reviewType: "livePreview",
      files: undefined,
      livePreviewLink: "",
    },
  })

  const reviewType = form.watch("reviewType")

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <div className="w-full h-auto flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What is the name of the product?</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="productField"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What is the field of this product?</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product field" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interestFields"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">What are the interest fields of your reviewers?</FormLabel>
                    <FormDescription>
                      Select all that apply.
                    </FormDescription>
                  </div>
                  {interestFields.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="interestFields"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reviewType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>What do you want people to review?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="images" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Images
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="livePreview" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Live Preview (Figma prototype, website)
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Tabs value={reviewType} className="w-full">
              <TabsContent value="images">
                <FormField
                  control={form.control}
                  name="screenCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How many screens does your app have?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select number of screens" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, '6+'].map((num) => (
                            <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="files"
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                      <FormLabel>Upload screenshots (max 5)</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(event) => onChange(event.target.files)}
                          {...rest}
                        />
                      </FormControl>
                      <FormDescription>
                        You can upload up to 5 JPG or PNG files.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value="livePreview">
                <FormField
                  control={form.control}
                  name="livePreviewLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Live Preview Link</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the URL of your Figma prototype or website.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            <Button type="submit" className="w-full">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Page
