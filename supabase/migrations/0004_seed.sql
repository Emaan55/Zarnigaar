-- Optional starter content so the storefront isn't empty on first run.
-- Product photography is intentionally omitted (product_images) — upload
-- real images via /admin/products once the store is live; product cards
-- render a soft placeholder until then. Safe to skip or edit before running.

insert into public.categories (slug, name, description) values
  ('clothing', 'Clothing', 'Lawn suits, co-ord sets and embroidered pieces.'),
  ('scarves', 'Scarves', 'Signature printed and woven scarves.'),
  ('dupattas', 'Dupattas', 'Embellished and embroidered dupattas.'),
  ('accessories', 'Accessories', 'Bags and finishing pieces.')
on conflict (slug) do nothing;

insert into public.collections (slug, name, description) values
  ('luxury-lawn', 'Luxury Lawn', 'Light, breezy, elegant lawn for every day.'),
  ('embroidered', 'Embroidered', 'Classic embroidery, timeless appeal.'),
  ('ready-to-wear', 'Ready to Wear', 'Comfort meets elegance in every piece.')
on conflict (slug) do nothing;

insert into public.products (slug, name, description, price, sale_price, sku, stock, category_id, sizes, colors, is_new, is_featured)
select v.slug, v.name, v.description, v.price, v.sale_price, v.sku, v.stock,
       (select id from public.categories where slug = v.category_slug),
       v.sizes, v.colors, v.is_new, v.is_featured
from (values
  ('embroidered-lawn-suit', 'Embroidered Lawn Suit', 'A three-piece embroidered lawn suit with delicate floral motifs, finished with a matching dupatta.', 8990, null::numeric, 'ZN-CL-001', 25, 'clothing', array['XS','S','M','L','XL'], array['Black','Ivory'], true, true),
  ('linen-co-ord-set', 'Linen Co-ord Set', 'A relaxed linen co-ord set tailored for effortless everyday elegance.', 6490, null, 'ZN-CL-002', 18, 'clothing', array['S','M','L','XL'], array['Ivory'], true, false),
  ('printed-lawn-suit', 'Printed Lawn Suit', 'Hand-finished printed lawn suit with contrast piping and a printed dupatta.', 5990, null, 'ZN-CL-003', 30, 'clothing', array['XS','S','M','L'], array['Blue'], true, false),
  ('solid-lawn-suit', 'Solid Lawn Suit', 'A solid-tone lawn suit with subtle self-embroidery along the neckline.', 6990, null, 'ZN-CL-004', 22, 'clothing', array['S','M','L','XL'], array['Sage'], true, false),
  ('signature-scarf', 'Signature Scarf', 'Our signature printed scarf in lightweight silk-blend fabric.', 2990, null, 'ZN-SC-001', 40, 'scarves', array['One Size'], array['Multi'], true, true),
  ('embroidered-suit', 'Embroidered Suit', 'A statement embroidered suit in rich jewel tones for special occasions.', 9990, 8490, 'ZN-CL-005', 12, 'clothing', array['S','M','L'], array['Rose'], false, true),
  ('classic-woven-dupatta', 'Classic Woven Dupatta', 'A finely woven dupatta with jacquard border detailing.', 3490, null, 'ZN-DP-001', 20, 'dupattas', array['One Size'], array['Beige'], false, false),
  ('embroidered-tote', 'Embroidered Tote', 'A structured tote finished with hand embroidery, for everyday carry.', 5490, null, 'ZN-AC-001', 15, 'accessories', array['One Size'], array['Black'], false, false)
) as v(slug, name, description, price, sale_price, sku, stock, category_slug, sizes, colors, is_new, is_featured)
on conflict (slug) do nothing;

insert into public.collection_products (collection_id, product_id)
select c.id, p.id from public.collections c, public.products p
where c.slug = 'luxury-lawn' and p.slug in ('printed-lawn-suit', 'solid-lawn-suit')
on conflict do nothing;

insert into public.collection_products (collection_id, product_id)
select c.id, p.id from public.collections c, public.products p
where c.slug = 'embroidered' and p.slug in ('embroidered-lawn-suit', 'embroidered-suit')
on conflict do nothing;

insert into public.collection_products (collection_id, product_id)
select c.id, p.id from public.collections c, public.products p
where c.slug = 'ready-to-wear' and p.slug in ('linen-co-ord-set', 'embroidered-suit')
on conflict do nothing;

insert into public.deals (title, description, cta_label, cta_href, active) values
  ('Flat 20% Off', 'On selected items. Limited time only.', 'Shop Now', '/new-in', true)
on conflict do nothing;

insert into public.faqs (question, answer, category, position) values
  ('How do I place an order?', 'Browse our collections, add items to your bag, and check out with either Cash on Delivery or secure online payment.', 'orders', 1),
  ('Can I change or cancel my order?', 'Contact us within 12 hours of placing your order and we will do our best to accommodate changes before it ships.', 'orders', 2),
  ('What are the shipping charges?', 'We offer flat-rate shipping across Pakistan, calculated at checkout based on your city.', 'shipping', 1),
  ('How long does delivery take?', 'Orders are typically delivered within 3-7 business days depending on your location.', 'shipping', 2),
  ('Is Cash on Delivery available?', 'Yes, COD is available across Pakistan on all orders.', 'cod', 1),
  ('Is online payment secure?', 'Yes. Online payments are processed through a secure, PCI-compliant gateway — we never store your card details.', 'payments', 1),
  ('What is your return policy?', 'Unused items in original condition with tags attached can be returned within 7 days of delivery.', 'returns', 1),
  ('How do I exchange an item?', 'Reach out via our Contact page with your order number and we will arrange a size or item exchange.', 'exchanges', 1),
  ('How do I find my size?', 'Refer to the Size Guide on every product page for detailed measurements.', 'sizing', 1),
  ('Are your fabrics pre-shrunk?', 'Our lawn and cotton pieces are pre-washed; we still recommend following the care label for longevity.', 'products', 1)
on conflict do nothing;
