import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import React from "react";
import { renderToStream } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", backgroundColor: "#ffffff" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20, borderBottomWidth: 1, borderColor: "#e5e7eb", paddingBottom: 15 },
  title: { fontSize: 20, fontWeight: "bold", color: "#1e40af" },
  subtitle: { fontSize: 9, color: "#6b7280" },
  section: { marginVertical: 10 },
  table: { width: "100%", borderTopWidth: 1, borderColor: "#e5e7eb", marginTop: 15 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#f3f4f6", paddingVertical: 8 },
  cellHeader: { fontWeight: "bold", color: "#374151" },
  colDesc: { width: "50%" },
  colQty: { width: "15%", textAlign: "center" },
  colPrice: { width: "17.5%", textAlign: "right" },
  colTotal: { width: "17.5%", textAlign: "right" },
  totalBox: { marginTop: 20, alignItems: "flex-end" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", width: "40%", paddingVertical: 3 },
  grandTotal: { fontWeight: "bold", fontSize: 12, color: "#1e40af" },
});

function InvoicePDF({ order }: { order: any }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>TechNova Electronics</Text>
            <Text style={styles.subtitle}>Official Tax Invoice & Receipt</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontWeight: "bold" }}>Invoice #{order.id.slice(-8).toUpperCase()}</Text>
            <Text style={styles.subtitle}>Date: {new Date(order.createdAt).toLocaleDateString()}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={{ fontWeight: "bold", marginBottom: 4 }}>Billed To:</Text>
          <Text>{order.address.fullName}</Text>
          <Text>{order.address.phone}</Text>
          <Text>{order.address.addressLine}, {order.address.city} {order.address.postalCode}</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, { backgroundColor: "#f9fafb" }]}>
            <Text style={[styles.colDesc, styles.cellHeader]}>Item Description</Text>
            <Text style={[styles.colQty, styles.cellHeader]}>Qty</Text>
            <Text style={[styles.colPrice, styles.cellHeader]}>Unit Price</Text>
            <Text style={[styles.colTotal, styles.cellHeader]}>Total</Text>
          </View>
          {order.items.map((item: any) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.colDesc}>{item.variant.product.name} ({item.variant.sku})</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>${item.priceAtPurchase.toFixed(2)}</Text>
              <Text style={styles.colTotal}>${(item.priceAtPurchase * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalBox}>
          <View style={styles.totalRow}>
            <Text>Subtotal:</Text>
            <Text>${order.subtotal.toFixed(2)}</Text>
          </View>
          {order.discount > 0 && (
            <View style={styles.totalRow}>
              <Text>Discount:</Text>
              <Text>-${order.discount.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text>Shipping Fee:</Text>
            <Text>${order.shipping.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Tax (5%):</Text>
            <Text>${order.tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text>Total Paid:</Text>
            <Text>${order.total.toFixed(2)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        address: true,
        items: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
      },
    });

    if (!order || (order.userId !== user.id && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    const stream = await renderToStream(<InvoicePDF order={order} />);

    return new NextResponse(stream as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=Invoice-${order.id.slice(-8)}.pdf`,
      },
    });
  } catch (error) {
    console.error("PDF Invoice Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
