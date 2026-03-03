import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

interface Institution {
  id: number
  name: string
}

interface InstitutionComboboxProps {
  institutions: Institution[]
  value: number | null
  onChange: (value: number) => void
}

export function InstitutionCombobox({
  institutions,
  value,
  onChange,
}: InstitutionComboboxProps) {
  const [open, setOpen] = useState(false)

  const selectedInstitution = institutions.find(
    (inst) => inst.id === value
  )

  return (
    <div className="space-y-2">
      <Label htmlFor="institution_id">Institution</Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedInstitution
              ? selectedInstitution.name
              : "Select institution..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search institution..." />
            <CommandEmpty>No institution found.</CommandEmpty>
            <CommandGroup>
              {institutions.map((inst) => (
                <CommandItem
                  key={inst.id}
                  value={inst.name}
                  onSelect={() => {
                    onChange(inst.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === inst.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {inst.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* hidden input supaya tetap terkirim ke backend */}
      <input
        id="institution_id"
        type="hidden"
        name="institution_id"
        value={value ?? ""}
    />
    </div>
  )
}