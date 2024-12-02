const stripe = Stripe(`ADD YOUR STRIPE PUBLIC KEY`);

const button = document.getElementById("create-intent");
button.addEventListener('click', async () => {
    const result = (await fetch("http://localhost:3000/secret"));
    const clientSecret = (await result.json()).client_secret;
    console.log(clientSecret);

    // Customize the appearance of Elements using the Appearance API.
    const appearance = { /* ... */ };

    // Enable the skeleton loader UI for the optimal loading experience.
    const loader = 'auto';

    // Create an elements group from the Stripe instance, passing the clientSecret (obtained in step 2), loader, and appearance (optional).
    const elements = stripe.elements({ clientSecret, appearance, loader });

    // Create Element instances
    const linkAuthenticationElement = elements.create("linkAuthentication",
        {
        defaultValues: {
            email: "resham.sapkota@chargebee.com"
        }
});
    // Passing in defaultValues is optional, but useful if you want to prefill consumer information to
    // ease consumer experience.
    const paymentElement = elements.create('payment', {
        defaultValues: {
            billingDetails: {
                name: 'John Doe',
                phone: '888-888-8888',
            },
        },
    });

    const button = document.getElementById("create-intent");
    button.hidden = 'true';

    const ele4 = document.querySelector("h4");
    ele4.style.display = 'block';
    const submitButton = document.getElementById("submit-field");
    submitButton.style.display = 'flex';

    // Mount the Elements to their corresponding DOM node
    linkAuthenticationElement.mount("#link-authentication-element");
    paymentElement.mount("#payment-element");

    const form = document.getElementById('payment-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const loader = document.getElementById("loader");
        loader.style.display = 'block';
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: "https://example.com/order/123/complete"
            }
        });
        if (error) {
            // Show error to your customer (for example, payment details incomplete)
            loader.style.display = 'none';
        } else {
            loader.style.display = 'none';
        }
    })
});