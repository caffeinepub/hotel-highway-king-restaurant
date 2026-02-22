export function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
        <h1 className="font-display font-bold text-4xl mb-8">
          Terms & Conditions
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Last updated: February 22, 2026
        </p>

        <section className="mb-8">
          <h2 className="font-display font-bold text-2xl mb-4">
            1. Introduction
          </h2>
          <p className="text-foreground/90 leading-relaxed">
            Welcome to Hotel Highway King And Restaurant's online food ordering
            service. By accessing our website and placing orders, you agree to
            comply with and be bound by these Terms and Conditions. Please read
            them carefully before using our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-display font-bold text-2xl mb-4">
            2. Service Description
          </h2>
          <p className="text-foreground/90 leading-relaxed mb-3">
            Hotel Highway King And Restaurant provides an online platform for
            ordering food items from our restaurant. Our services include:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/90">
            <li>Online menu browsing and food ordering</li>
            <li>Pickup service from our restaurant location</li>
            <li>Home delivery within our service area</li>
            <li>Multiple payment options (Cash on Delivery and Online Payment)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="font-display font-bold text-2xl mb-4">
            3. Order Acceptance
          </h2>
          <p className="text-foreground/90 leading-relaxed mb-3">
            All orders placed through our website are subject to acceptance by
            Hotel Highway King And Restaurant. We reserve the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/90">
            <li>
              Accept or reject any order at our sole discretion, including for
              reasons of product unavailability or payment issues
            </li>
            <li>Limit order quantities per customer or per order</li>
            <li>Modify or discontinue any menu item without prior notice</li>
            <li>
              Cancel orders if we suspect fraudulent activity or payment issues
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="font-display font-bold text-2xl mb-4">
            4. Pricing and Payment
          </h2>
          <p className="text-foreground/90 leading-relaxed mb-3">
            All prices are displayed in Indian Rupees (INR) and include
            applicable taxes. Additional charges may apply:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/90">
            <li>GST/Tax: 5% on all orders</li>
            <li>Delivery fee: ₹30 for home delivery orders</li>
            <li>
              Prices are subject to change without notice. The price charged
              will be the price displayed at the time of order placement
            </li>
            <li>
              Payment can be made via Cash on Delivery or Online Payment (UPI,
              Credit/Debit Card)
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="font-display font-bold text-2xl mb-4">
            5. Delivery Terms
          </h2>
          <p className="text-foreground/90 leading-relaxed mb-3">
            For delivery orders:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/90">
            <li>
              Estimated delivery time is 30-40 minutes from order confirmation
            </li>
            <li>
              Delivery is available only within our designated service area
            </li>
            <li>
              A valid delivery address and contact number must be provided
            </li>
            <li>
              We are not responsible for delays caused by incorrect address
              information or customer unavailability
            </li>
            <li>
              Orders must be received by the customer or an authorized person at
              the delivery address
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="font-display font-bold text-2xl mb-4">
            6. Food Quality and Safety
          </h2>
          <p className="text-foreground/90 leading-relaxed">
            We take food quality and safety seriously. All food is prepared
            following proper hygiene and safety standards. However, customers
            with food allergies or dietary restrictions should inform us at the
            time of ordering. We cannot guarantee that our food is completely
            free from allergens or suitable for all dietary requirements.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-display font-bold text-2xl mb-4">
            7. User Responsibilities
          </h2>
          <p className="text-foreground/90 leading-relaxed mb-3">
            As a user of our service, you agree to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/90">
            <li>
              Provide accurate and complete information when placing orders
            </li>
            <li>Maintain the confidentiality of your account credentials</li>
            <li>
              Not engage in any fraudulent or illegal activity on our platform
            </li>
            <li>
              Accept responsibility for all orders placed through your account
            </li>
            <li>Treat delivery personnel with respect and courtesy</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="font-display font-bold text-2xl mb-4">
            8. Limitation of Liability
          </h2>
          <p className="text-foreground/90 leading-relaxed">
            Hotel Highway King And Restaurant shall not be liable for any
            indirect, incidental, special, or consequential damages arising from
            the use of our service or consumption of our food products. Our
            total liability shall not exceed the amount paid for the specific
            order in question.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-display font-bold text-2xl mb-4">
            9. Intellectual Property
          </h2>
          <p className="text-foreground/90 leading-relaxed">
            All content on our website, including text, graphics, logos, images,
            and software, is the property of Hotel Highway King And Restaurant
            and is protected by intellectual property laws. You may not
            reproduce, distribute, or create derivative works without our
            express written permission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-display font-bold text-2xl mb-4">
            10. Changes to Terms
          </h2>
          <p className="text-foreground/90 leading-relaxed">
            We reserve the right to modify these Terms and Conditions at any
            time. Changes will be effective immediately upon posting on our
            website. Your continued use of our services after changes are posted
            constitutes acceptance of the modified terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-display font-bold text-2xl mb-4">
            11. Governing Law
          </h2>
          <p className="text-foreground/90 leading-relaxed">
            These Terms and Conditions shall be governed by and construed in
            accordance with the laws of India. Any disputes arising from these
            terms shall be subject to the exclusive jurisdiction of the courts
            in Uttar Pradesh, India.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-display font-bold text-2xl mb-4">
            12. Contact Information
          </h2>
          <p className="text-foreground/90 leading-relaxed">
            For questions about these Terms and Conditions, please contact us:
          </p>
          <div className="bg-muted p-6 rounded-lg mt-4">
            <p className="font-semibold mb-2">Hotel Highway King And Restaurant</p>
            <p className="text-foreground/90">
              Varanasi-Sultanpur Highway
              <br />
              Uttar Pradesh - 222109
              <br />
              Operating Hours: 7:00 AM - 11:00 PM (Daily)
              <br />
              Call/WhatsApp for inquiries
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
