import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent, useState } from "react";
import { TInvoiceItem, useInvoice } from "./InvoiceProvider";

const emptyItem = {
  name: "",
  quantity: "",
  rate: "",
};
export function AddItemDialog() {
  const [item, setItem] = useState<TInvoiceItem>(emptyItem);

  const {
    setItem: { add },
  } = useInvoice();
  const [err, setErr] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name, type } = e.target;
    if (type === "number") setItem((prev) => ({ ...prev, [name]: +value }));
    else setItem((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = () => {
    console.log(item);
    // return;
    const { name, quantity, rate } = item;
    console.log(name.length, quantity === "", rate === "");
    if (name.length === 0 || quantity === "" || rate === "") setErr("Error");
    else {
      item.total_amt = +quantity * +rate;
      add(item);
      setItem(emptyItem);
      setErr("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add more Items</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Items</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 grid-cols-2 grid-rows-2">
          <div className="col-span-2 items-center gap-4">
            <Label htmlFor="item_name" className="text-right">
              Item name
            </Label>
            <Input
              id="item_name"
              name="name"
              className="col-span-3"
              onChange={handleChange}
              value={item.name}
            />
          </div>
          <div className="">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              className="col-span-3"
              onChange={handleChange}
              value={item.quantity}
            />
          </div>
          <div className="">
            <Label htmlFor="rate" className="text-right">
              Rate
            </Label>
            <div></div>
            <Input
              id="rate"
              name="rate"
              type="number"
              className="col-span-3"
              onChange={handleChange}
              value={item.rate}
            />
          </div>
        </div>
        <p className="text-red-500 block text-center">{err}</p>
        <DialogFooter>
          <Button onClick={() => onSubmit()}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
