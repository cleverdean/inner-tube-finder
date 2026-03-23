import { TubeFinder } from "@/components/TubeFinder/TubeFinder";
import { Helmet } from "react-helmet";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can I use a tube that's a different size than my tire?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The diameter must match exactly. Width can vary slightly — tubes come in ranges, and a tube labeled 700x25-32c will fit any tire in that width range. A tube slightly narrower than your tire is fine; much wider is not recommended."
      }
    },
    {
      "@type": "Question",
      "name": "How do I find my bicycle inner tube size?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Look at the sidewall of your tire — the size is molded into the rubber. You'll see a number like 700x28c (road bike), 26x2.1 (mountain bike), or 20x1-3/8 (folding bike like Brompton). The first number is the wheel diameter, the second is the tire width. Enter that into the tube finder above."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between Presta and Schrader valves?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Presta valves are tall, narrow, and all-metal with a small lock nut at the top. They're common on road bikes and higher-end city bikes. Schrader valves are wider and look like car tire valves — common on mountain bikes, kids bikes, and cargo bikes. Your rim has a hole drilled for one specific type, so you must match your valve to your rim."
      }
    },
    {
      "@type": "Question",
      "name": "What size inner tube does a Brompton need?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "All current Brompton models (C Line, P Line, T Line, G Line) use a 16-inch wheel with a 349mm bead diameter. The standard tube size is 16x1-3/8 with a Schrader valve. Note that Brompton 16-inch wheels use the 349mm bead — different from standard 16-inch kids bike wheels (305mm)."
      }
    },
    {
      "@type": "Question",
      "name": "Do e-bikes need special inner tubes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "E-bikes don't require special tubes, but heavier-gauge butyl tubes are recommended because e-bikes are heavier and often ridden faster. Match your tire size closely, and check that your valve length is sufficient for your rim depth — many cargo e-bikes have thicker rims."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between 700c and 29 inch wheels?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "700c (road bike) and 29-inch (mountain bike) wheels have the exact same bead diameter — 622mm ISO. The names are different but the wheels are interchangeable in terms of tube and tire fitting. A 700x40c tube will fit a 29x1.5 tire."
      }
    },
    {
      "@type": "Question",
      "name": "Can I patch a bike inner tube instead of replacing it?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — a properly applied glue-on patch on butyl rubber is completely reliable and will outlast the tube. Glueless self-adhesive patches work for emergencies but often fail over time. Latex tubes are harder to patch and are generally replaced rather than repaired."
      }
    }
  ]
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "BikeStore",
  "name": "Clever Cycles",
  "url": "https://clevercycles.com",
  "telephone": "",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "900 SE Hawthorne Blvd",
    "addressLocality": "Portland",
    "addressRegion": "OR",
    "postalCode": "97214",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 45.5122,
    "longitude": -122.6587
  },
  "openingHoursSpecification": [],
  "description": "Portland bike shop specializing in Brompton folding bikes, cargo bikes, e-bikes, and city commuters.",
  "hasMap": "https://maps.google.com/?q=Clever+Cycles+900+SE+Hawthorne+Blvd+Portland+OR"
};

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Bicycle Inner Tube Size Guide & Finder | Clever Cycles Portland</title>
        <meta
          name="description"
          content="Find the right bicycle inner tube for your tire size. Comprehensive guide to reading tire sizes, valve types, and tube materials. Quick-select for Brompton, Tern, Urban Arrow, cargo bikes and more. Expert advice from Clever Cycles in Portland, OR."
        />
        <meta property="og:title" content="Bicycle Inner Tube Size Guide & Finder | Clever Cycles Portland" />
        <meta property="og:description" content="Not sure what inner tube you need? Enter your tire size or browse by bike type. Free expert guidance from Portland's bike shop specializing in cargo bikes, e-bikes, and Brompton folding bikes." />
        <meta name="keywords" content="bicycle inner tube size, bike tube finder, inner tube guide, Brompton inner tube, cargo bike inner tube, Portland bike shop, Presta Schrader valve, 700c inner tube, 20 inch inner tube" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
      </Helmet>

      <main className="min-h-screen">
        <div className="container py-12 px-4 md:py-16">
          <TubeFinder />
        </div>

        <section className="container px-4 py-12 max-w-3xl mx-auto prose prose-gray">

          <h2>The Complete Guide to Bicycle Inner Tube Sizes</h2>
          <p>Getting a flat tire is inevitable. Knowing how to find the right replacement tube is a skill every cyclist needs — and it's easier than it looks once you understand the system. This guide covers everything: how to read your tire, what all the numbers mean, which valve you need, and what to look for if you ride a cargo bike, e-bike, or folding bike.</p>

          <hr />

          <h2>Step 1: Read Your Tire Sidewall</h2>
          <p>Every bicycle tire has its size molded into the sidewall rubber. Flip your bike, look at the side of the tire, and you'll find a number like one of these:</p>
          <ul>
            <li><strong>700x28c</strong> — road bike, hybrid, or city bike</li>
            <li><strong>26x2.1</strong> — mountain bike</li>
            <li><strong>20x1-3/8</strong> — folding bike (common on Brompton)</li>
            <li><strong>27.5x2.25</strong> — modern mountain bike</li>
            <li><strong>29x2.1</strong> — 29er mountain bike (same diameter as 700c road)</li>
            <li><strong>20x4.0</strong> — fat tire / cargo bike</li>
            <li><strong>40-622</strong> — ISO/ETRTO format (explained below)</li>
          </ul>
          <p>The first number is always the <strong>wheel diameter</strong>, the second is the <strong>tire width</strong>. Enter either format into the finder above and it will match you to compatible tubes.</p>

          <h3>What If the Size Is Worn Off?</h3>
          <p>If the sidewall marking is too faded to read, check the other tire — they're usually the same. If both are unreadable, look for the old tube (it will have its size printed on it) or bring the wheel into the shop and we can measure it.</p>

          <hr />

          <h2>Understanding the Three Tire Size Systems</h2>
          <p>Bicycle tire sizing is notoriously confusing because three different systems exist and they don't always agree. Here's how they relate:</p>

          <h3>Inch System (e.g., 26x2.1)</h3>
          <p>Common on mountain bikes and older bikes. The diameter is in inches (26", 27.5", 29") and the width is also in inches. Straightforward — but "26 inch" MTB wheels and "26 inch" cruiser/city wheels are actually different sizes at the bead. Always verify with the ISO number if in doubt.</p>

          <h3>French / Road System (e.g., 700x28c)</h3>
          <p>Used on road bikes, hybrids, gravel, and most city bikes. The "700c" refers to the approximate outer diameter, and the number after the "x" is the tire width in millimeters. The "c" is a holdover from an old French system — just treat it as part of the name.</p>
          <p><strong>Note:</strong> 700c (road) and 29" (MTB) wheels have the same bead diameter (622mm). A 700x40c tube will fit a 29x1.5 tire. The diameter is identical; only the names differ.</p>

          <h3>ISO / ETRTO System (e.g., 40-622)</h3>
          <p>The most precise system. Two numbers: first is <strong>tire width in mm</strong>, second is <strong>bead seat diameter in mm</strong>. "40-622" means a 40mm wide tire on a 622mm diameter rim. Always unambiguous — two tires with the same ISO number are always compatible.</p>

          <h4>Common ISO / ETRTO Reference</h4>
          <ul>
            <li><strong>622mm</strong> — 700c road / 29" MTB</li>
            <li><strong>584mm</strong> — 650b / 27.5" MTB</li>
            <li><strong>559mm</strong> — 26" MTB</li>
            <li><strong>507mm</strong> — 24" kids / some cruisers</li>
            <li><strong>451mm</strong> — 20" (some folding bikes)</li>
            <li><strong>406mm</strong> — 20" BMX / cargo bikes (Tern, Urban Arrow rear)</li>
            <li><strong>349mm</strong> — 16" Brompton (C, P, T, G Line)</li>
            <li><strong>305mm</strong> — 16" kids bikes</li>
          </ul>

          <hr />

          <h2>Tube Width Range: You Don't Need an Exact Match</h2>
          <p>Unlike the diameter (which must match exactly), tube width is flexible. Tubes are sold in ranges like "700x25-32c" or "26x1.75-2.125". As long as your tire's width falls within that range, the tube will fit.</p>
          <p>A tube slightly narrower than your tire will stretch to fit — normal and expected. A tube that's too wide can bunch up inside the tire and cause pinch flats. When in doubt, go with a tube whose range closely matches your tire width.</p>

          <hr />

          <h2>Valve Types: Presta vs. Schrader</h2>
          <p>Your rim has a hole drilled for one specific valve type. Using the wrong valve means it won't fit properly. Here's how to tell them apart:</p>

          <h3>Presta Valve</h3>
          <ul>
            <li>Tall, narrow, all-metal with a small threaded lock nut at the top</li>
            <li>Must unscrew the lock nut before you can add or release air</li>
            <li>Common on road bikes, high-end city bikes, and many e-bikes</li>
            <li>Rim hole is narrow (~6mm)</li>
            <li>Available in different lengths — important for deep-section rims</li>
          </ul>

          <h3>Schrader Valve</h3>
          <ul>
            <li>Wider, looks exactly like a car tire valve</li>
            <li>Spring-loaded internal pin — press to release air</li>
            <li>Common on mountain bikes, kids bikes, and many cargo bikes</li>
            <li>Rim hole is wider (~8mm)</li>
            <li>Works with any gas station air compressor</li>
          </ul>

          <h3>Which Do I Have?</h3>
          <p>Look at your current tube's valve — or the hole in your rim. A Presta hole is narrow (about the width of a pencil). A Schrader hole is noticeably wider. You can fit a Presta tube into a Schrader rim with an adapter, but you cannot fit a Schrader tube into a Presta rim.</p>

          <h3>Valve Length</h3>
          <p>If your rims are deep (aero road wheels, some cargo bike rims), you need a longer valve — typically 48mm, 60mm, or 80mm — so the stem extends far enough through the rim to attach a pump. Standard rims work with a 32–40mm valve.</p>

          <hr />

          <h2>Tube Materials: Butyl vs. Latex</h2>

          <h3>Butyl Rubber (Standard)</h3>
          <p>Almost all replacement tubes are butyl rubber — black, flexible, durable, and inexpensive. Holds air well for weeks between pumping. Repairable with a standard patch kit. This is what you want for commuting, cargo bikes, and everyday riding.</p>

          <h3>Latex (Performance)</h3>
          <p>Lighter and more supple than butyl, latex tubes offer slightly lower rolling resistance. Used by road racers. Downsides: more expensive, lose air faster (pump before every ride), harder to patch. Not practical for commuting or cargo use.</p>

          <h3>Thick / Puncture-Resistant</h3>
          <p>Some tubes are made with thicker butyl walls for increased flat resistance. A good choice for urban commuting on rough streets, or for cargo bikes carrying heavy loads where a flat mid-ride is especially inconvenient.</p>

          <hr />

          <h2>E-Bike Inner Tubes: What's Different</h2>
          <p>E-bikes don't require special tubes, but a few things are worth knowing:</p>
          <ul>
            <li><strong>Go heavier gauge.</strong> E-bikes are heavier and often ridden faster. A standard tube works, but slightly thicker butyl holds up better over time.</li>
            <li><strong>Match your tire closely.</strong> Extra weight puts more stress on the bead area. Don't use a tube significantly under or over your tire width.</li>
            <li><strong>Check valve length.</strong> Many cargo e-bikes (Urban Arrow, Tern GSD, Riese &amp; Müller) have thicker rims — make sure your valve is long enough.</li>
            <li><strong>Cargo bikes have different front and rear sizes.</strong> Urban Arrow front and rear wheels are different sizes — use the quick-select above to get the right tube for each wheel.</li>
          </ul>

          <hr />

          <h2>Inner Tube Size Reference by Bike Type</h2>

          <h3>Brompton Folding Bikes</h3>
          <ul>
            <li><strong>C Line, P Line, T Line, G Line</strong> — 16x1-3/8 (349mm bead), Schrader valve</li>
            <li><strong>Brompton with wider tires</strong> — 16x1.5 (349mm), check sidewall for width</li>
            <li>Brompton 16" uses 349mm bead — different from 16" kids bikes (305mm). Don't mix them up.</li>
          </ul>

          <h3>Tern Cargo Bikes</h3>
          <ul>
            <li><strong>Tern GSD, HSD</strong> — 20x2.15 or 20x2.35 (406mm bead), Schrader — check sidewall</li>
            <li><strong>Tern Quick Haul</strong> — 20" (406mm), check sidewall for width</li>
          </ul>

          <h3>Urban Arrow Cargo Bikes</h3>
          <ul>
            <li><strong>Urban Arrow Family (front)</strong> — 20" (406mm), check sidewall for width</li>
            <li><strong>Urban Arrow Family (rear)</strong> — 26" (559mm), check sidewall for width</li>
            <li>Front and rear are different — use the quick-select above</li>
          </ul>

          <h3>Road Bikes</h3>
          <ul>
            <li>700c wheel (622mm ISO), width typically 23c–32c</li>
            <li>Almost always Presta valve</li>
            <li>Example: 700x25-32c tube for a 700x28c tire</li>
          </ul>

          <h3>Mountain Bikes</h3>
          <ul>
            <li><strong>26"</strong> (559mm) — older bikes, common widths 1.9–2.35"</li>
            <li><strong>27.5" / 650b</strong> (584mm) — mid-size MTB, widths 2.1–2.4"</li>
            <li><strong>29"</strong> (622mm) — same bead as 700c road, widths 2.1–2.4"</li>
            <li>Usually Schrader valve</li>
          </ul>

          <h3>Kids Bikes</h3>
          <ul>
            <li><strong>12"</strong> (203mm) — balance bikes</li>
            <li><strong>16"</strong> (305mm) — early pedal bikes (different from Brompton 16")</li>
            <li><strong>20"</strong> (406mm) — older kids, also BMX</li>
            <li><strong>24"</strong> (507mm) — tweens</li>
            <li>Almost always Schrader valve</li>
          </ul>

          <hr />

          <h2>Frequently Asked Questions</h2>

          <h3>Can I use a tube that's a different size than my tire?</h3>
          <p>The diameter must match exactly. Width can vary slightly — tubes come in ranges, and a tube labeled 700x25-32c will fit any tire in that width range. A tube slightly narrower than your tire is fine; much wider is not recommended.</p>

          <h3>My tube says 700x18-25c but my tire is 700x28c — will it work?</h3>
          <p>Probably not reliably. The tube will stretch, but you're beyond the safe range. Get a tube rated 700x25-32c or 700x28-35c for a 700x28c tire.</p>

          <h3>What's the difference between a 20" BMX tube and a Brompton tube?</h3>
          <p>Completely different wheels. Brompton uses the 349mm bead diameter; standard 20" BMX/cargo uses 406mm. Always verify by the ISO number, not the inch label.</p>

          <h3>How often should I replace my inner tubes?</h3>
          <p>Replace them when they puncture and can't be reliably patched, when the valve stem leaks, or if the rubber feels brittle. Carrying a spare is always smart — especially on cargo bikes and e-bikes where a flat mid-ride is a bigger problem.</p>

          <h3>Can I patch a tube instead of replacing it?</h3>
          <p>Yes — a good patch job on butyl rubber is perfectly reliable. Glue-on patches done properly will outlast the tube. Glueless self-adhesive patches are fine for emergency use but often fail over time.</p>

          <h3>Do I need a special tube for a tubeless-ready rim?</h3>
          <p>No. If you're running tubes in a tubeless-ready rim, any standard tube that matches the tire size works fine. Just make sure the valve length is appropriate for the rim depth.</p>

          <h3>What PSI should I inflate my tube to?</h3>
          <p>Your tire sidewall lists the recommended pressure range (e.g., "65-95 PSI"). Stay within that range. Narrower road tires run higher pressure; wider cargo and MTB tires run lower. E-bikes often benefit from slightly higher pressure due to added weight.</p>

          <hr />

          <h2>Still Not Sure? We Can Help.</h2>
          <p>Clever Cycles has been selling and servicing bikes in Portland since 2000. We specialize in Brompton folding bikes, cargo bikes, e-bikes, and city commuters — and we stock inner tubes for all of them. If the finder above didn't answer your question, stop in at <strong>900 SE Hawthorne Blvd</strong> and we'll figure it out together. No appointment needed for a tube question.</p>

        </section>

        <footer className="py-6 bg-gradient-aubergine">
          <div className="container text-center text-sm text-white/80">
            <p>Clever Cycles · 900 SE Hawthorne Blvd · Portland, OR · clevercycles.com</p>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Index;
