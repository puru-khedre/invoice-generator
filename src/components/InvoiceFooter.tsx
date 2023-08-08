import { ChangeEvent, FC, useState } from "react";
import { Input } from "./ui/input";
import LabeledInput from "./LabeledInput";
import { IndianRupee, Percent, Plus } from "lucide-react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useInvoice } from "./InvoiceProvider";
import { formatCurrency } from "@/lib/utils";
import { useReactToPrint } from "react-to-print";

interface InvoiceFooterProps {}
const InvoiceFooter: FC<InvoiceFooterProps> = () => {
  const [isDiscount, setIsDiscount] = useState<boolean>(false);
  const [isShipping, setIsShipping] = useState<boolean>(false);

  const {
    footerData: { tax, discount, shipping, paid },
    setFooter,
    amounts: { sub_total, discount_amt, tax_amt, due_amt, total },
    saveToHistory,
    printRef,
  } = useInvoice();

  const handlePrint = useReactToPrint({
    content() {
      return printRef.current;
    },
  });

  console.log();

  const handleChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement>) => {
    setFooter((prev) => ({ ...prev, [name]: +value }));
  };

  return (
    <div className="w-full grid grid-cols-2">
      <div className="print:hidden">
        <span className="mr-2">
          <Button onClick={handlePrint}>Print</Button>
        </span>
        <Button onClick={saveToHistory} variant={"outline"}>
          Save
        </Button>
      </div>
      <div className="hidden print:block"></div>

      <div className="ml-auto space-y-2 flex flex-col items-end">
        <div className="hidden print:grid grid-cols-[3fr_3fr] gap-2 items-center place-items-end mr-2">
          <>
            <span>Sub Total: </span>
            <p className="font-medium">{formatCurrency(sub_total)}</p>
          </>
          {isDiscount && (
            <>
              <span>Discount ({discount}%): </span>
              <p className="font-medium">{formatCurrency(discount_amt)}</p>
            </>
          )}
          <>
            <span>Tax ({tax}%): </span>
            <p className="font-medium">{formatCurrency(tax_amt)}</p>
          </>
          {isShipping && (
            <>
              <span>Shipping cost: </span>
              <p className="font-medium">{formatCurrency(+shipping)}</p>
            </>
          )}
          <>
            <span>Total: </span>
            <p className="font-medium">{formatCurrency(total)}</p>
          </>
          <>
            <span>Amount Paid: </span>
            <p className="font-medium">{formatCurrency(+paid)}</p>
          </>
        </div>

        <div className="grid grid-cols-[1fr_3fr] gap-2 items-center print:hidden">
          <>
            <strong>Sub total:</strong>
            <p>{formatCurrency(sub_total)}</p>
          </>

          {isDiscount && (
            <>
              <Label htmlFor="discount">Discount</Label>
              <LabeledInput Icon={Percent} labelFor="discount">
                <Input
                  className="rounded-r-none"
                  id="discount"
                  type="number"
                  name="discount"
                  value={discount}
                  onChange={handleChange}
                />
              </LabeledInput>
            </>
          )}

          <>
            <Label htmlFor="tax">Tax %</Label>
            <LabeledInput Icon={Percent} labelFor="tax">
              <Input
                className="rounded-r-none"
                id="tax"
                type="number"
                value={tax}
                name="tax"
                onChange={handleChange}
                min={0}
              />
            </LabeledInput>
          </>

          {isShipping && (
            <>
              <Label htmlFor="shipping">Shipping</Label>
              <LabeledInput Icon={IndianRupee} labelFor="shipping">
                <Input
                  className="rounded-r-none"
                  id="shipping"
                  type="number"
                  value={shipping}
                  min={0}
                  name="shipping"
                  onChange={handleChange}
                />
              </LabeledInput>
            </>
          )}

          <div
            className={`col-span-2 flex gap-2 justify-end items-center print:hidden ${
              isDiscount && isShipping && "hidden"
            } `}
          >
            <Button
              variant="outline"
              className={`text-green-500 hover:text-green-700 border-green-400 hover:bg-green-200 ${
                isDiscount && "hidden"
              }`}
              onClick={() => setIsDiscount((prev) => !prev)}
            >
              <Plus />
              Discount
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsShipping((prev) => !prev)}
              className={`text-green-500 hover:text-green-700 border-green-400 hover:bg-green-200 ${
                isShipping && "hidden"
              }`}
            >
              <Plus />
              Shipping
            </Button>
          </div>

          <>
            <strong>Total: </strong>
            <p>{formatCurrency(total)}</p>
          </>

          <>
            <Label htmlFor="amount_paid">Amount Paid</Label>
            <LabeledInput
              Icon={IndianRupee}
              className=""
              isIconLeft={false}
              labelFor="amount_paid"
            >
              <Input
                className="rounded-r-none"
                id="amount_paid"
                type="number"
                value={paid}
                name="paid"
                onChange={handleChange}
              />
            </LabeledInput>
          </>

          <>
            <strong>Balance Due: </strong>
            <p>{formatCurrency(due_amt)}</p>
          </>
        </div>
      </div>
    </div>
  );
};

export default InvoiceFooter;
