-- Remove only exact starter copy. Preserve custom content and existing URL slugs.
update public.categories set description = 'Explore our clothing articles.' where description = 'Lawn suits, co-ord sets and embroidered pieces.';
update public.collections set name = 'Clothing Selection' where name = 'Luxury Lawn';
update public.collections set description = 'Explore the articles in this collection.' where description = 'Light, breezy, elegant lawn for every day.';
update public.products set name = 'Embroidered Suit' where name = 'Embroidered Lawn Suit';
update public.products set description = 'See the article details provided by Zarnigaar.' where description = 'A three-piece embroidered lawn suit with delicate floral motifs, finished with a matching dupatta.';
update public.products set name = 'Co-ord Set' where name = 'Linen Co-ord Set';
update public.products set description = 'See the article details provided by Zarnigaar.' where description = 'A relaxed linen co-ord set tailored for effortless everyday elegance.';
update public.products set name = 'Printed Suit' where name = 'Printed Lawn Suit';
update public.products set description = 'See the article details provided by Zarnigaar.' where description = 'Hand-finished printed lawn suit with contrast piping and a printed dupatta.';
update public.products set name = 'Solid Suit' where name = 'Solid Lawn Suit';
update public.products set description = 'See the article details provided by Zarnigaar.' where description = 'A solid-tone lawn suit with subtle self-embroidery along the neckline.';
update public.products set description = 'See the article details provided by Zarnigaar.' where description = 'Our signature printed scarf in lightweight silk-blend fabric.';
update public.faqs set answer = 'Refer to the fabric details and care instructions provided for each article. Contact us if you need more information.' where answer = 'Our lawn and cotton pieces are pre-washed; we still recommend following the care label for longevity.';
