// Hand-written types mirroring supabase/migrations/0001_schema.sql.
// Structured so `supabase gen types typescript` output can replace the
// `Database` interface below without touching call sites, which consume
// the `Tables<'x'>` / `Row<'x'>` helpers. The `Relationships` arrays below
// are what `supabase-js` needs to type-check embedded (`foo ( bar )`)
// selects — kept accurate to the real foreign keys in 0001_schema.sql.

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";
export type PaymentMethod = "cod" | "online";
export type PaymentStatus = "pending" | "paid" | "failed";
export type DiscountType = "percentage" | "fixed";
export type ProductStatus = "active" | "draft" | "archived";
export type ProfileRole = "customer" | "admin";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          role: ProfileRole;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      admin_users: {
        Row: { user_id: string; role: string; created_at: string };
        Insert: { user_id: string; role?: string };
        Update: Partial<{ role: string }>;
        Relationships: [
          {
            foreignKeyName: "admin_users_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["categories"]["Row"]> & {
          slug: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Row"]>;
        Relationships: [];
      };
      collections: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["collections"]["Row"]
        > & { slug: string; name: string };
        Update: Partial<Database["public"]["Tables"]["collections"]["Row"]>;
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string;
          price: number;
          sale_price: number | null;
          sku: string;
          stock: number;
          category_id: string | null;
          sizes: string[];
          colors: string[];
          is_new: boolean;
          is_featured: boolean;
          is_sold_out: boolean;
          status: ProductStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["products"]["Row"]> & {
          slug: string;
          name: string;
          price: number;
          sku: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt: string;
          position: number;
        };
        Insert: Partial<
          Database["public"]["Tables"]["product_images"]["Row"]
        > & { product_id: string; url: string };
        Update: Partial<Database["public"]["Tables"]["product_images"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      collection_products: {
        Row: { collection_id: string; product_id: string };
        Insert: { collection_id: string; product_id: string };
        Update: Partial<{ collection_id: string; product_id: string }>;
        Relationships: [
          {
            foreignKeyName: "collection_products_collection_id_fkey";
            columns: ["collection_id"];
            isOneToOne: false;
            referencedRelation: "collections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "collection_products_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          address: string;
          city: string;
          province: string;
          postal_code: string;
          payment_method: PaymentMethod;
          payment_status: PaymentStatus;
          status: OrderStatus;
          subtotal: number;
          shipping: number;
          discount_total: number;
          total: number;
          discount_code: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["orders"]["Row"]> & {
          order_number: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          address: string;
          city: string;
          province: string;
          postal_code: string;
          payment_method: PaymentMethod;
          subtotal: number;
          total: number;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          name: string;
          image: string | null;
          price: number;
          size: string | null;
          color: string | null;
          quantity: number;
          line_total: number;
        };
        Insert: Partial<
          Database["public"]["Tables"]["order_items"]["Row"]
        > & {
          order_id: string;
          name: string;
          price: number;
          quantity: number;
          line_total: number;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      discounts: {
        Row: {
          id: string;
          code: string;
          type: DiscountType;
          value: number;
          min_order: number;
          usage_limit: number | null;
          used_count: number;
          starts_at: string | null;
          ends_at: string | null;
          active: boolean;
          applicable_product_ids: string[];
          applicable_category_ids: string[];
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["discounts"]["Row"]> & {
          code: string;
          type: DiscountType;
          value: number;
        };
        Update: Partial<Database["public"]["Tables"]["discounts"]["Row"]>;
        Relationships: [];
      };
      discount_usages: {
        Row: {
          id: string;
          discount_id: string;
          order_id: string;
          user_id: string | null;
          used_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["discount_usages"]["Row"]
        > & { discount_id: string; order_id: string };
        Update: Partial<
          Database["public"]["Tables"]["discount_usages"]["Row"]
        >;
        Relationships: [
          {
            foreignKeyName: "discount_usages_discount_id_fkey";
            columns: ["discount_id"];
            isOneToOne: false;
            referencedRelation: "discounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "discount_usages_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      deals: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          image_url: string | null;
          cta_label: string | null;
          cta_href: string | null;
          starts_at: string | null;
          ends_at: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["deals"]["Row"]> & {
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["deals"]["Row"]>;
        Relationships: [];
      };
      wishlists: {
        Row: { id: string; user_id: string; created_at: string };
        Insert: { id?: string; user_id: string };
        Update: Partial<{ user_id: string }>;
        Relationships: [
          {
            foreignKeyName: "wishlists_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      wishlist_items: {
        Row: {
          id: string;
          wishlist_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: { id?: string; wishlist_id: string; product_id: string };
        Update: Partial<{ wishlist_id: string; product_id: string }>;
        Relationships: [
          {
            foreignKeyName: "wishlist_items_wishlist_id_fkey";
            columns: ["wishlist_id"];
            isOneToOne: false;
            referencedRelation: "wishlists";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "wishlist_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      faqs: {
        Row: {
          id: string;
          question: string;
          answer: string;
          category: string;
          position: number;
        };
        Insert: Partial<Database["public"]["Tables"]["faqs"]["Row"]> & {
          question: string;
          answer: string;
        };
        Update: Partial<Database["public"]["Tables"]["faqs"]["Row"]>;
        Relationships: [];
      };
      media: {
        Row: {
          id: string;
          url: string;
          path: string;
          filename: string;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["media"]["Row"]> & {
          url: string;
          path: string;
          filename: string;
        };
        Update: Partial<Database["public"]["Tables"]["media"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "media_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_messages: {
        Row: { id: string; name: string; email: string; message: string; created_at: string };
        Insert: { id?: string; name: string; email: string; message: string };
        Update: Partial<{ name: string; email: string; message: string }>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
