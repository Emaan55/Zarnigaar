"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const SIZE_ROWS = [
  { size: "XS", bust: "32", waist: "25", hip: "35" },
  { size: "S", bust: "34", waist: "27", hip: "37" },
  { size: "M", bust: "36", waist: "29", hip: "39" },
  { size: "L", bust: "38", waist: "31", hip: "41" },
  { size: "XL", bust: "40", waist: "33", hip: "43" },
];

export function SizeGuideDialog() {
  return (
    <Dialog>
      <DialogTrigger render={<button type="button" className="text-xs font-medium underline underline-offset-4" />}>
        Size Guide
      </DialogTrigger>
      <DialogContent className="max-w-md bg-cream">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl font-normal">Size Guide</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground">All measurements are in inches.</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Size</TableHead>
              <TableHead>Bust</TableHead>
              <TableHead>Waist</TableHead>
              <TableHead>Hip</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SIZE_ROWS.map((row) => (
              <TableRow key={row.size}>
                <TableCell className="font-medium">{row.size}</TableCell>
                <TableCell>{row.bust}&quot;</TableCell>
                <TableCell>{row.waist}&quot;</TableCell>
                <TableCell>{row.hip}&quot;</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
