import { Mail, Phone, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UnverifiedCard() {
  return (
    <div className="glass rounded-2xl border-destructive/25 p-5">
      <h3 className="flex items-center gap-2 text-base font-semibold">
        <Search className="h-4 w-4 text-primary" aria-hidden="true" />
        🔍 I couldn't verify that yet
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        I searched the official club knowledge base but couldn't find enough information to answer
        your question reliably. I won't guess or invent AWS information.
      </p>

      <div className="glass mt-4 rounded-xl p-4">
        <p className="flex items-center gap-2 text-sm font-medium">
          Need help? <User className="h-4 w-4 text-primary" aria-hidden="true" /> Campus AWS Student
          Builder Contact
        </p>
        <p className="mt-2 text-sm text-muted-foreground">Shanmukha Sasi Sadineni</p>
        <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-3.5 w-3.5" aria-hidden="true" />
          <a href="tel:7396025334" className="hover:text-foreground">
            7396025334
          </a>
        </p>
        <Button className="mt-4" asChild>
          <a href="mailto:sadinenisasi@gmail.com">
            <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
            Contact Group Leader
          </a>
        </Button>
      </div>
    </div>
  );
}
