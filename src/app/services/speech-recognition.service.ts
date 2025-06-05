// import { Injectable } from "@angular/core"
// import type { HttpClient } from "@angular/common/http"
// import { Observable, from, of } from "rxjs"
// import { catchError, map } from "rxjs/operators"

// @Injectable({
//   providedIn: "root",
// })
// export class SpeechRecognitionService {
//   private mediaRecorder: MediaRecorder | null = null
//   private audioChunks: Blob[] = []
//   private readonly API_URL = "http://localhost:3000/api/speech/recognize"

//   constructor(private http: HttpClient) {}

//   startRecording(): Observable<boolean> {
//     return from(navigator.mediaDevices.getUserMedia({ audio: true })).pipe(
//       map((stream) => {
//         this.mediaRecorder = new MediaRecorder(stream)
//         this.audioChunks = []

//         this.mediaRecorder.addEventListener("dataavailable", (event) => {
//           if (event.data.size > 0) {
//             this.audioChunks.push(event.data)
//           }
//         })

//         this.mediaRecorder.start()
//         return true
//       }),
//       catchError((error) => {
//         console.error("Error accessing microphone:", error)
//         return of(false)
//       }),
//     )
//   }

//   stopRecording(): Observable<string> {
//     return new Observable<string>((observer) => {
//       if (!this.mediaRecorder) {
//         observer.error("No recording in progress")
//         observer.complete()
//         return
//       }

//       this.mediaRecorder.addEventListener("stop", () => {
//         const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" })

//         // Stop all tracks in the stream
//         this.mediaRecorder?.stream.getTracks().forEach((track) => track.stop())

//         // Send to Coqui STT server
//         this.sendAudioToServer(audioBlob).subscribe({
//           next: (transcript) => {
//             observer.next(transcript)
//             observer.complete()
//           },
//           error: (error) => {
//             observer.error(error)
//             observer.complete()
//           },
//         })
//       })

//       this.mediaRecorder.stop()
//     })
//   }

//   private sendAudioToServer(audioBlob: Blob): Observable<string> {
//     const formData = new FormData()
//     formData.append("audio", audioBlob)

//     return this.http.post<{ transcript: string }>(this.API_URL, formData).pipe(
//       map((response) => response.transcript),
//       catchError((error) => {
//         console.error("Error sending audio to server:", error)
//         return this.fallbackToWebSpeechAPI(audioBlob)
//       }),
//     )
//   }

//   // Fallback to browser's Web Speech API if server fails
//   private fallbackToWebSpeechAPI(audioBlob: Blob): Observable<string> {
//     return new Observable<string>((observer) => {
//       if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
//         observer.error("Speech recognition not supported in this browser")
//         observer.complete()
//         return
//       }

//       // Create audio URL and play it
//       const audioUrl = URL.createObjectURL(audioBlob)
//       const audio = new Audio(audioUrl)

//       // Initialize speech recognition
//       const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
//       const recognition = new SpeechRecognition()

//       recognition.lang = "en-US"
//       recognition.interimResults = false
//       recognition.maxAlternatives = 1

//       recognition.onresult = (event: any) => {
//         const transcript = event.results[0][0].transcript
//         observer.next(transcript)
//         observer.complete()
//       }

//       recognition.onerror = (event: any) => {
//         observer.error(`Speech recognition error: ${event.error}`)
//         observer.complete()
//       }

//       // Play the audio and start recognition
//       audio.onplay = () => {
//         recognition.start()
//       }

//       audio.onended = () => {
//         recognition.stop()
//       }

//       audio.play().catch((error) => {
//         observer.error(`Error playing audio: ${error}`)
//         observer.complete()
//       })
//     })
//   }
// }

// New stuff here
// import { Injectable, PLATFORM_ID, Inject } from "@angular/core"
// import { isPlatformBrowser } from "@angular/common"
// import { type Observable, Subject } from "rxjs"

// @Injectable({
//   providedIn: "root",
// })
// export class SpeechRecognitionService {
//   private webSpeechRecognition: any = null
//   private transcriptionSubject = new Subject<string>()
//   private isBrowser: boolean

//   constructor(@Inject(PLATFORM_ID) platformId: Object) {
//     this.isBrowser = isPlatformBrowser(platformId);

//     // Only initialize Web Speech API if we're in a browser
//     if (this.isBrowser) {
//       this.initWebSpeechAPI();
//     }
//   }

//   /**
//    * Initialize Web Speech API
//    */
//   private initWebSpeechAPI(): void {
//     // Make sure we're in a browser environment
//     if (!this.isBrowser) {
//       return
//     }

//     if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
//       // @ts-ignore - TypeScript doesn't know about webkitSpeechRecognition
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
//       this.webSpeechRecognition = new SpeechRecognition()
//       this.webSpeechRecognition.continuous = false
//       this.webSpeechRecognition.interimResults = true

//       this.webSpeechRecognition.onresult = (event: any) => {
//         const current = event.resultIndex
//         const transcript = event.results[current][0].transcript
//         this.transcriptionSubject.next(transcript)
//       }

//       this.webSpeechRecognition.onerror = (event: any) => {
//         console.error("Speech recognition error", event.error)
//         this.transcriptionSubject.error("Speech recognition error: " + event.error)
//       }

//       this.webSpeechRecognition.onend = () => {
//         this.transcriptionSubject.complete()
//       }
//     } else {
//       console.warn("Web Speech API not supported in this browser")
//     }
//   }

//   /**
//    * Start recording audio
//    */
//   startRecording(): Observable<string> {
//     // Reset the subject for a new recording session
//     this.transcriptionSubject = new Subject<string>()

//     // Check if we're in a browser and have speech recognition
//     if (!this.isBrowser) {
//       this.transcriptionSubject.error("Speech recognition is only available in browser environments")
//       return this.transcriptionSubject.asObservable()
//     }

//     if (this.webSpeechRecognition) {
//       this.webSpeechRecognition.start()
//     } else {
//       this.transcriptionSubject.error("Speech recognition not supported in this browser")
//     }

//     return this.transcriptionSubject.asObservable()
//   }

//   /**
//    * Stop recording audio
//    */
//   stopRecording(): void {
//     if (this.isBrowser && this.webSpeechRecognition) {
//       this.webSpeechRecognition.stop()
//     }
//   }
// }

import { Injectable, PLATFORM_ID, Inject } from "@angular/core"
import { isPlatformBrowser } from "@angular/common"
import { type Observable, Subject } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class SpeechRecognitionService {
  private webSpeechRecognition: any = null
  private transcriptionSubject = new Subject<string>()
  private isBrowser: boolean

  // Array of languages to try in order of preference
  private languagesToTry = [
    navigator.language || "en-US", // Try user's browser language first
    "en-US", // Then try English (US)
    "en-GB", // Then English (UK)
    "en", // Then generic English
  ]

  private currentLanguageIndex = 0

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Only initialize Web Speech API if we're in a browser
    if (this.isBrowser) {
      this.initWebSpeechAPI();
    }
  }

  /**
   * Initialize Web Speech API
   */
  private initWebSpeechAPI(): void {
    // Make sure we're in a browser environment
    if (!this.isBrowser) {
      return
    }

    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      // @ts-ignore - TypeScript doesn't know about webkitSpeechRecognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      this.webSpeechRecognition = new SpeechRecognition()

      // Configure speech recognition
      this.webSpeechRecognition.continuous = false
      this.webSpeechRecognition.interimResults = true

      // Try the first language in our list
      this.webSpeechRecognition.lang = this.languagesToTry[this.currentLanguageIndex]
      console.log(`Trying language: ${this.webSpeechRecognition.lang}`)

      this.webSpeechRecognition.onresult = (event: any) => {
        console.log("Speech recognition result event:", event)

        // Get the most recent result
        const current = event.resultIndex
        const transcript = event.results[current][0].transcript
        console.log("Transcribed text:", transcript)

        this.transcriptionSubject.next(transcript)
      }

      this.webSpeechRecognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event)

        if (event.error === "language-not-supported") {
          // Try the next language in our list
          this.currentLanguageIndex++

          if (this.currentLanguageIndex < this.languagesToTry.length) {
            console.log(
              `Language not supported. Trying next language: ${this.languagesToTry[this.currentLanguageIndex]}`,
            )
            this.webSpeechRecognition.lang = this.languagesToTry[this.currentLanguageIndex]

            // Restart recognition with the new language
            setTimeout(() => {
              try {
                this.webSpeechRecognition.start()
              } catch (error) {
                console.error("Error restarting speech recognition:", error)
                this.transcriptionSubject.error("Failed to restart speech recognition")
              }
            }, 100)

            return
          } else {
            // We've tried all languages
            console.error("All languages failed. Falling back to no language specification")
            this.webSpeechRecognition.lang = ""
          }
        }

        this.transcriptionSubject.error("Speech recognition error: " + event.error)
      }

      this.webSpeechRecognition.onend = () => {
        console.log("Speech recognition ended")
        this.transcriptionSubject.complete()
      }
    } else {
      console.warn("Web Speech API not supported in this browser")
    }
  }

  /**
   * Start recording audio
   */
  startRecording(): Observable<string> {
    console.log("Speech service: Starting recording...")

    // Reset language index to try the preferred language first
    this.currentLanguageIndex = 0

    // Reset the subject for a new recording session
    this.transcriptionSubject = new Subject<string>()

    // Check if we're in a browser and have speech recognition
    if (!this.isBrowser) {
      console.error("Not in browser environment")
      this.transcriptionSubject.error("Speech recognition is only available in browser environments")
      return this.transcriptionSubject.asObservable()
    }

    if (this.webSpeechRecognition) {
      try {
        // Set the language to the first one in our list
        this.webSpeechRecognition.lang = this.languagesToTry[this.currentLanguageIndex]
        console.log(`Starting speech recognition with language: ${this.webSpeechRecognition.lang}`)

        this.webSpeechRecognition.start()
        console.log("Speech recognition started")
      } catch (error) {
        console.error("Error starting speech recognition:", error)
        this.transcriptionSubject.error("Failed to start speech recognition")
      }
    } else {
      console.error("Speech recognition not supported")
      this.transcriptionSubject.error("Speech recognition not supported in this browser")
    }

    return this.transcriptionSubject.asObservable()
  }

  /**
   * Stop recording audio
   */
  stopRecording(): void {
    console.log("Speech service: Stopping recording...")

    if (this.isBrowser && this.webSpeechRecognition) {
      try {
        this.webSpeechRecognition.stop()
        console.log("Speech recognition stopped")
      } catch (error) {
        console.error("Error stopping speech recognition:", error)
      }
    }
  }
}
