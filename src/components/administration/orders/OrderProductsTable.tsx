import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { OrderedProduct } from "@/generated/prisma";
import { formatPrice } from "@/lib/utils";

interface OrderProductsTableProps {
    products: OrderedProduct[];
}

const OrderProductsTable = ({ products }: OrderProductsTableProps) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell className="font-medium">
                            {item.name}
                        </TableCell>
                        <TableCell>
                            {item.size && <span>Size: {item.size}</span>}
                            {item.color && (
                                <span className="block">
                                    Color: {item.color}
                                </span>
                            )}
                        </TableCell>
                        <TableCell className="text-right">
                            {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                            {formatPrice(item.retailPrice)}
                        </TableCell>
                        <TableCell className="text-right">
                            {formatPrice(item.retailPrice * item.quantity)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default OrderProductsTable;
