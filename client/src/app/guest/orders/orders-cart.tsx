"use client";

import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/constants/type";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useGuestGetOrderListQuery } from "@/queries/useGuest";
import Image from "next/image";
import { useMemo } from "react";

export default function OrdersCart() {
  const { data } = useGuestGetOrderListQuery();
  const orders = useMemo(() => data?.payload.data ?? [], [data]);
  const { waitingForPaying, paid } = useMemo(() => {
    return orders.reduce(
      (result, order) => {
        if (
          order.status === OrderStatus.Delivered ||
          order.status === OrderStatus.Processing ||
          order.status === OrderStatus.Pending
        ) {
          return {
            ...result,
            waitingForPaying: {
              price:
                result.waitingForPaying.price +
                order.dishSnapshot.price * order.quantity,
              quantity: result.waitingForPaying.quantity + order.quantity,
            },
          };
        }
        if (order.status === OrderStatus.Paid) {
          return {
            ...result,
            paid: {
              price:
                result.paid.price + order.dishSnapshot.price * order.quantity,
              quantity: result.paid.quantity + order.quantity,
            },
          };
        }
        return result;
      },
      {
        waitingForPaying: {
          price: 0,
          quantity: 0,
        },
        paid: {
          price: 0,
          quantity: 0,
        },
      }
    );
  }, [orders]);

  return (
    <>
      {orders.map((order, index) => (
        <div key={order.id} className="flex gap-4">
          <div className="text-sm font-semibold">{index + 1}</div>
          <div className="flex-shrink-0 relative">
            <Image
              src={order.dishSnapshot.image}
              alt={order.dishSnapshot.name}
              height={100}
              width={100}
              quality={100}
              className="object-cover w-[80px] h-[80px] rounded-md"
            />
          </div>
          <div className="space-y-1 flex flex-col justify-evenly">
            <h3 className="text-sm line-clamp-2">{order.dishSnapshot.name}</h3>
            <div className="text-xs font-semibold text-yellow-400">
              {formatCurrency(order.dishSnapshot.price)}
              <Badge className="px-1 ml-2"> x{order.quantity}</Badge>
            </div>
          </div>
          <div className="flex-shrink-0 ml-auto flex justify-center items-center">
            <Badge variant={"outline"}>
              {getVietnameseOrderStatus(order.status)}
            </Badge>
          </div>
        </div>
      ))}
      {paid.quantity !== 0 && (
        <div className="sticky bottom-0 ">
          <div className="w-full flex space-x-4 text-xl font-semibold">
            <span>Đơn đã thanh toán · {paid.quantity} món</span>
            <span>{formatCurrency(paid.price)}</span>
          </div>
        </div>
      )}
      <div className="sticky bottom-0 ">
        <div className="w-full flex space-x-4 text-xl font-semibold">
          <span>Đơn chưa thanh toán · {waitingForPaying.quantity} món</span>
          <span className="text-yellow-500 mt-[1px]">
            {formatCurrency(waitingForPaying.price)}
          </span>
        </div>
      </div>
    </>
  );
}
