export function RefundPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
        <h1 className="font-display font-bold text-4xl mb-8">
          Refund & Cancellation Policy
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Last updated: February 22, 2026
        </p>

        <section className="mb-8">
          <h2 className="font-display font-bold text-2xl mb-4">
            1. Introduction
          </h2>
          <p className="text-foreground/90 leading-relaxed">
            At Hotel Highway King And Restaurant, we strive to provide the best
            food and service to our customers. This Refund & Cancellation Policy
            outlines the terms and conditions for order cancellations and
            refunds. Please read this policy carefully before placing your order.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-display font-bold text-2xl mb-4">
            2. Order Cancellation by Customer
          </h2>

          <h3 className="font-display font-semibold text-xl mb-3 mt-6">
            2.1 Cancellation Before Preparation
          </h3>
          <p className="text-foreground/90 leading-relaxed mb-3">
            You may cancel your order before it enters the "Preparing" status:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/90">
            <li>
              Orders can be cancelled while in "Pending" status through your
              order history page
            </li>
            <li>
              For online payments, full refund will be processed within 3-7
              working days
            </li>
            <li>
              For Cash on Delivery orders, no payment has been collected, so no
              refund is necessary
            </li>
          </ul>

          <h3 className="font-display font-semibold text-xl mb-3 mt-6">
            2.2 Cancellation After Preparation Starts
          </h3>
          <p className="text-foreground/90 leading-relaxed">
            Once your order status changes to "Preparing," "Ready," or
            "Completed," cancellation is not possible through the website. In
            exceptional circumstances, you may contact us directly, but refunds
            are not guaranteed once food preparation has begun.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-display font-bold text-2xl mb-4">
            3. Order Cancellation by Restaurant
          </h2>
          <p className="text-foreground/90 leading-relaxed mb-3">
            We reserve the right to cancel orders in the following situations:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/90">
            <li>Menu items are unavailable or out of stock</li>
            <li>
              Payment issues or suspected fraudulent activity on your account
            </li>
            <li>
              Delivery address is outside our service area or cannot be reached
            </li>
            <li>Force majeure events (natural disasters, emergencies, etc.)</li>
            <li>Technical errors resulting in incorrect pricing or order details</li>
          </ul>
          <p className="text-foreground/90 leading-relaxed mt-3">
            If we cancel your order, you will be notified immediately, and a
            full refund will be processed if payment was already made.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-display font-bold text-2xl mb-4">
            4. Refund Policy
          </h2>

          <h3 className="font-display font-semibold text-xl mb-3 mt-6">
            4.1 Refund Eligibility
          </h3>
          <p className="text-foreground/90 leading-relaxed mb-3">
            Refunds are provided in the following cases:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/90">
            <li>
              Order cancelled by customer before preparation begins (Pending
              status only)
            </li>
            <li>Order cancelled by restaurant for any reason</li>
            <li>
              Significant quality issues with the food (must be reported within
              30 minutes of delivery/pickup)
            </li>
            <li>Wrong items delivered or missing items from your order</li>
            <li>
              Order not delivered within a reasonable timeframe without prior
              communication
            </li>
          </ul>

          <h3 className="font-display font-semibold text-xl mb-3 mt-6">
            4.2 Refund Process
          </h3>
          <p className="text-foreground/90 leading-relaxed mb-3">
            The refund process depends on your payment method:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/90">
            <li>
              <strong>Online Payment (UPI/Card):</strong> Refunds will be
              processed to the original payment method within 3-7 working days
            </li>
            <li>
              <strong>Cash on Delivery:</strong> No refund is necessary if the
              order is cancelled before delivery, as no payment has been made
            </li>
            <li>
              Refund processing time may vary depending on your bank or payment
              provider
            </li>
            <li>
              You will receive a confirmation email once the refund is initiated
            </li>
          </ul>

          <h3 className="font-display font-semibold text-xl mb-3 mt-6">
            4.3 Partial Refunds
          </h3>
          <p className="text-foreground/90 leading-relaxed">
            In cases where only part of your order is affected (e.g., one item
            missing or incorrect), we may issue a partial refund or offer a
            replacement. The decision will be made on a case-by-case basis after
            reviewing the situation.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-display font-bold text-2xl mb-4">
            5. Non-Refundable Cases
          </h2>
          <p className="text-foreground/90 leading-relaxed mb-3">
            Refunds will NOT be provided in the following situations:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/90">
            <li>
              Order cancellation requested after food preparation has started
              (status: Preparing, Ready, or Completed)
            </li>
            <li>
              Customer unavailability at delivery address or incorrect address
              provided
            </li>
            <li>
              Customer refuses delivery after the order has been prepared and
              dispatched
            </li>
            <li>
              Subjective taste preferences or dissatisfaction not related to
              quality issues
            </li>
            <li>
              Delays caused by factors beyond our control (traffic, weather,
              etc.) with prior communication
            </li>
            <li>
              Issues not reported within 30 minutes of delivery or pickup
            </li>
            <li>
              Orders already consumed partially or fully before reporting an
              issue
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="font-display font-bold text-2xl mb-4">
            6. How to Request a Refund
          </h2>
          <p className="text-foreground/90 leading-relaxed mb-3">
            If you believe you are eligible for a refund, please follow these
            steps:
          </p>
          <ol className="list-decimal pl-6 space-y-3 text-foreground/90">
            <li>
              <strong>Immediate Issues:</strong> Contact us via phone/WhatsApp
              within 30 minutes of receiving your order if there are quality
              issues, missing items, or incorrect items
            </li>
            <li>
              <strong>Cancellation:</strong> Use the "Cancel Order" button on
              your order history page if your order is still in "Pending" status
            </li>
            <li>
              <strong>Provide Details:</strong> When contacting us, provide your
              order ID, a description of the issue, and photographic evidence if
              applicable
            </li>
            <li>
              <strong>Review Process:</strong> Our team will review your request
              and respond within 24 hours with a resolution
            </li>
            <li>
              <strong>Refund Processing:</strong> If approved, refunds will be
              initiated within 1-2 business days and credited within 3-7 working
              days
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="font-display font-bold text-2xl mb-4">
            7. Delivery Issues
          </h2>
          <p className="text-foreground/90 leading-relaxed mb-3">
            In case of delivery-related issues:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/90">
            <li>
              If delivery is significantly delayed beyond the estimated time, we
              will proactively contact you with an update
            </li>
            <li>
              If you cannot be reached at the provided phone number or delivery
              address, the order may be cancelled without refund
            </li>
            <li>
              For incorrect address information provided by customer, additional
              delivery charges may apply for redelivery
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="font-display font-bold text-2xl mb-4">
            8. Quality Complaints
          </h2>
          <p className="text-foreground/90 leading-relaxed">
            We take food quality very seriously. If you receive food that does
            not meet our quality standards, please contact us immediately with
            photographic evidence. We will investigate the issue and provide an
            appropriate resolution, which may include a full refund, partial
            refund, or replacement order.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-display font-bold text-2xl mb-4">
            9. Refund Timeline
          </h2>
          <div className="bg-muted p-6 rounded-lg">
            <ul className="list-none space-y-3 text-foreground/90">
              <li>
                <strong>Refund Initiation:</strong> Within 1-2 business days of
                approval
              </li>
              <li>
                <strong>Credit to Original Payment Method:</strong> 3-7 working
                days from initiation
              </li>
              <li>
                <strong>Bank Processing:</strong> Additional 2-3 days depending
                on your bank
              </li>
              <li>
                <strong>Total Expected Time:</strong> Up to 10-12 business days
                in some cases
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-display font-bold text-2xl mb-4">
            10. Changes to This Policy
          </h2>
          <p className="text-foreground/90 leading-relaxed">
            We reserve the right to modify this Refund & Cancellation Policy at
            any time. Changes will be effective immediately upon posting on our
            website. Your continued use of our services after changes are posted
            constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-display font-bold text-2xl mb-4">
            11. Contact Us
          </h2>
          <p className="text-foreground/90 leading-relaxed mb-4">
            For cancellation requests, refund inquiries, or quality complaints,
            please contact us:
          </p>
          <div className="bg-muted p-6 rounded-lg">
            <p className="font-semibold mb-2">
              Hotel Highway King And Restaurant
            </p>
            <p className="text-foreground/90">
              Varanasi-Sultanpur Highway
              <br />
              Uttar Pradesh - 222109
              <br />
              Operating Hours: 7:00 AM - 11:00 PM (Daily)
              <br />
              Call/WhatsApp for immediate assistance
              <br />
              <br />
              <strong>Note:</strong> For urgent issues with current orders,
              please call/WhatsApp us directly for fastest resolution.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-display font-bold text-2xl mb-4">
            12. Dispute Resolution
          </h2>
          <p className="text-foreground/90 leading-relaxed">
            If you are not satisfied with our refund decision, you may escalate
            the matter by contacting our management team. We are committed to
            resolving all customer concerns fairly and promptly. Any disputes
            that cannot be resolved amicably will be subject to the jurisdiction
            of courts in Uttar Pradesh, India.
          </p>
        </section>
      </div>
    </div>
  );
}
