import { toast as sonnerToast, type ToastT } from "sonner"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

export function useToast() {
  const toast = ({ title, description, variant, duration }: ToastProps) => {
    return sonnerToast(title, {
      description,
      duration,
      className: variant === "destructive" ? "destructive" : undefined,
    })
  }

  return { toast }
}

export { toast } from "sonner"