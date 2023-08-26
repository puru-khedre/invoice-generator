import { ChangeEvent, FC, useEffect, useState } from "react";
import { Input } from "./ui/input";
import LabeledInput from "./LabeledInput";
import { Percent, Plus } from "lucide-react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useInvoice } from "./InvoiceProvider";
import { currencyIcon, formatCurrency } from "@/lib/utils";
import { useReactToPrint } from "react-to-print";
import { SaveInvoiceConfirmation } from "./SaveInvoiceConfirmation";
import { Textarea } from "./ui/textarea";

interface InvoiceFooterProps {}
const InvoiceFooter: FC<InvoiceFooterProps> = () => {
  const [isDiscount, setIsDiscount] = useState<boolean>(false);
  const [isShipping, setIsShipping] = useState<boolean>(false);

  const {
    footerData: { other_taxes, discount, shipping, paid, terms },
    setFooter,
    amounts: {
      sub_total,
      discount_amt,
      other_taxes_amt,
      due_amt,
      total,
      gst_amt,
    },
    printRef,
    currency,
    headerData: { invoice_number },
  } = useInvoice();

  useEffect(() => {
    setIsDiscount(discount != "");
    setIsShipping(shipping != "");
  }, [discount, shipping]);

  const handlePrint = useReactToPrint({
    content() {
      return printRef.current;
    },
    documentTitle: `Invoice # ${invoice_number}`,
  });

  const handleChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    if (name === "terms") setFooter((prev) => ({ ...prev, [name]: value }));
    else setFooter((prev) => ({ ...prev, [name]: +value }));
  };

  return (
    <div className="w-full grid grid-cols-2">
      <div>
        <div className="space-y-2 mb-3 print:hidden">
          <label htmlFor="terms">Terms & conditions:</label>
          <Textarea
            placeholder="Terms and conditions"
            className="max-h-[150px]"
            id="terms"
            value={terms}
            name="terms"
            onChange={handleChange}
          />
        </div>
        <div className="space-y-1 mb-3 hidden print:block">
          <div>
            <p className="font-semibold text-lg">Account details</p>
            <div>
              <span className="text-gray-500 font-medium">Account No.: </span>
              {"3534656786585654"}
            </div>
            <div>
              <span className="text-gray-500 font-medium">
                Bank/Swift code:{" "}
              </span>
              {"3534656786585654"}
            </div>

            <div>
              <span className="text-gray-500 font-medium">IFSC code: </span>
              {"3534656786585654"}
            </div>
          </div>

          <div className={`${terms == "" && "hidden"}`}>
            <span className="font-semibold text-lg">Terms & conditions:</span>
            {terms.split("\n").map((term, i) => (
              <p key={i}>{term}</p>
            ))}
          </div>
        </div>
        <div className="print:hidden">
          <span className="mr-2">
            <Button onClick={handlePrint}>Print</Button>
          </span>
          <SaveInvoiceConfirmation />
        </div>
      </div>

      <div className="ml-auto space-y-2 flex flex-col items-end">
        <div className="grid grid-cols-[1fr_3fr] gap-2 items-center print:hidden">
          <>
            <strong>Sub total:</strong>
            <p>{formatCurrency(sub_total, undefined, currency)}</p>
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

          {currency === "INR" && (
            <>
              <strong className="text-sm">IGST(9%):</strong>
              <p>{formatCurrency(gst_amt / 2, undefined, currency)}</p>
              <strong className="text-sm">CGST(9%):</strong>
              <p>{formatCurrency(gst_amt / 2, undefined, currency)}</p>
            </>
          )}

          {currency !== "INR" && (
            <>
              <Label htmlFor="other_taxes">Other Taxes %</Label>
              <LabeledInput Icon={Percent} labelFor="other_taxes">
                <Input
                  className="rounded-r-none"
                  id="other_taxes"
                  type="number"
                  value={other_taxes}
                  name="other_taxes"
                  onChange={handleChange}
                  min={0}
                />
              </LabeledInput>
            </>
          )}

          {isShipping && (
            <>
              <Label htmlFor="shipping">Shipping</Label>
              <LabeledInput Icon={currencyIcon(currency)} labelFor="shipping">
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
            <p>{formatCurrency(total, undefined, currency)}</p>
          </>

          <>
            <Label htmlFor="amount_paid">Amount Paid</Label>
            <LabeledInput
              Icon={currencyIcon(currency)}
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
            <strong>Amount due: </strong>
            <p>{formatCurrency(due_amt, undefined, currency)}</p>
          </>
        </div>

        <div className="hidden print:grid grid-cols-[3fr_3fr] gap-2 items-center place-items-end mr-2">
          <>
            <span>Sub Total: </span>
            <p className="font-medium">
              {formatCurrency(sub_total, undefined, currency)}
            </p>
          </>
          {isDiscount && (
            <>
              <span>Discount ({discount}%): </span>
              <p className="font-medium">
                {formatCurrency(discount_amt, undefined, currency)}
              </p>
            </>
          )}
          {currency === "INR" && (
            <>
              <span className="text-sm">IGST(9%):</span>
              <p>{formatCurrency(gst_amt / 2, undefined, currency)}</p>
              <span className="text-sm">CGST(9%):</span>
              <p>{formatCurrency(gst_amt / 2, undefined, currency)}</p>
            </>
          )}

          {other_taxes !== "" && +other_taxes != 0 && (
            <>
              <span>Other Taxes ({other_taxes}%): </span>
              <p className="font-medium">
                {formatCurrency(other_taxes_amt, undefined, currency)}
              </p>
            </>
          )}
          {isShipping && (
            <>
              <span>Shipping cost: </span>
              <p className="font-medium">
                {formatCurrency(+shipping, undefined, currency)}
              </p>
            </>
          )}
          <>
            <span>Total: </span>
            <p className="font-medium">
              {formatCurrency(total, undefined, currency)}
            </p>
          </>
          <>
            <span>Amount Paid: </span>
            <p className="font-medium">
              {formatCurrency(+paid, undefined, currency)}
            </p>
          </>
        </div>
      </div>
    </div>
  );
};

export default InvoiceFooter;
