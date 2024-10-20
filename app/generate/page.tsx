"use client";

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Copy, ExternalLink, X } from 'lucide-react'

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
  reviewType: z.enum(["static", "livePreview"], {
    required_error: "Please select a review type.",
  }),
  screenCount: z.string().optional(),
  files: z.any().optional(),
  livePreviewLink: z.string().url().optional(),
  productInfo: z.string().min(100, {
    message: "Product info must be at least 100 characters.",
  }),
}).refine((data) => {
  if (data.reviewType === "static") {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reviewLink, setReviewLink] = useState<string | null>(null);

  useEffect(() => {
    const storedLink = localStorage.getItem('reviewLink');
    if (storedLink) {
      setReviewLink(storedLink);
    }
  }, []);

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
      productInfo: "",
    },
  })

  const reviewType = form.watch("reviewType")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to create config');
      }

      const result = await response.json();
      console.log('Config created:', result);
      const link = `https://localhost:3000/review/${result.configId}`;
      setReviewLink(link);
      localStorage.setItem('reviewLink', link);
    } catch (error) {
      console.error('Error creating config:', error);
      setSubmitError('Failed to create config. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const copyToClipboard = () => {
    if (reviewLink) {
      navigator.clipboard.writeText(reviewLink);
    }
  }

  const closeReviewLink = () => {
    setReviewLink(null);
    localStorage.removeItem('reviewLink');
  }

  return (
    <div className="w-full h-auto flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md relative">
        <AnimatePresence>
          {reviewLink && (
            <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-0 left-0 right-0 p-4 bg-green-100 rounded-t-lg flex justify-between items-center"
          >
            <span className="text-green-800 font-medium">{reviewLink}</span>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={copyToClipboard}
                className="text-green-800 hover:text-green-900"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => window.open(reviewLink, '_blank')}
                className="text-green-800 hover:text-green-900"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={closeReviewLink}
                className="text-green-800 hover:text-green-900"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
          )}
        </AnimatePresence>
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
                          <RadioGroupItem value="static" />
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
              <TabsContent value="static">
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
            <FormField
              control={form.control}
              name="productInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Information</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter detailed information about your product" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a brief description of your product and its key features.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {submitError && (
              <div className="text-red-500 text-sm">{submitError}</div>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Page