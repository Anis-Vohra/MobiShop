"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, ImageIcon } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { apiClient } from "@/lib/api"

interface ImageUploadProps {
  jobId: string
  images: string[]
  onImagesChange: (images: string[]) => void
}

export function ImageUpload({ jobId, images, onImagesChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          throw new Error(`${file.name} is not an image file`)
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} is too large. Maximum size is 5MB`)
        }

        const result = await apiClient.uploadJobImage(jobId, file)
        return result.url
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      const newImages = [...images, ...uploadedUrls]
      onImagesChange(newImages)

      toast({
        title: "Images uploaded",
        description: `${uploadedUrls.length} image(s) uploaded successfully.`,
      })
    } catch (error) {
      console.error("Error uploading images:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload images",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove)
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Job Photos</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? "Uploading..." : "Upload Photos"}
        </Button>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />

      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <Card key={index} className="relative group">
              <CardContent className="p-2">
                <div className="aspect-square relative overflow-hidden rounded-md">
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt={`Job photo ${index + 1}`}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=200&width=200"
                    }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground text-center">
              No photos uploaded yet. Click "Upload Photos" to add images.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
