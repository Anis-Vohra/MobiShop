import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  const { userId } = auth()

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const jobId = formData.get("jobId") as string

    if (!file || !jobId) {
      return new NextResponse("File and job ID are required", { status: 400 })
    }

    // Verify the job belongs to the user
    const { data: jobData, error: jobError } = await supabase
      .from("jobs")
      .select("id")
      .eq("id", jobId)
      .eq("user_id", userId)
      .single()

    if (jobError || !jobData) {
      return new NextResponse("Job not found or does not belong to user", { status: 404 })
    }

    // Convert the file to an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Generate a unique file name
    const fileName = `${Date.now()}-${file.name}`
    const filePath = `${userId}/${jobId}/${fileName}`

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage.from("job-images").upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    })

    if (error) {
      console.error("Error uploading file:", error)
      return new NextResponse("Error uploading file", { status: 500 })
    }

    // Get the public URL of the uploaded file
    const { data: publicUrlData } = supabase.storage.from("job-images").getPublicUrl(filePath)

    // Update the job's images array to include the new image URL
    const { data: job, error: updateError } = await supabase.from("jobs").select("images").eq("id", jobId).single()

    if (updateError) {
      console.error("Error fetching job images:", updateError)
      return new NextResponse("Error fetching job images", { status: 500 })
    }

    const images = job.images || []
    images.push(publicUrlData.publicUrl)

    const { error: saveError } = await supabase.from("jobs").update({ images }).eq("id", jobId)

    if (saveError) {
      console.error("Error updating job images:", saveError)
      return new NextResponse("Error updating job images", { status: 500 })
    }

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
    })
  } catch (error) {
    console.error("Error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
