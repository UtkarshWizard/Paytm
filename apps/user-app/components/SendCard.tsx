"use client";

import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";
import { p2pTranfer } from "../app/lib/actions/p2pTransfer";

export const SendCard = () => {
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState(0);
  return (
    <div className="h-[90vh]">
      <Center>
        <Card title={"Send Money"}>
          <div className="min-w-72 pt-2">
            <TextInput
              label={"Enter Number"}
              placeholder={"1234567890"}
              onChange={(value) => {
                setNumber(value);
              }}
            />
            <TextInput
              label={"Enter Amount"}
              placeholder={"123123"}
              onChange={(value) => {
                setAmount(Number(value));
              }}
            />
            <div className="pt-4 flex justify-center">
              <Button onClick={ async () => {
                await p2pTranfer(number , amount * 100)
              }}>Send Money</Button>
            </div>
          </div>
        </Card>
      </Center>
    </div>
  );
};
