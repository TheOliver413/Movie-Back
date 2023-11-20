const express = require('express');
const app = express();
const stripe = require('stripe')('sk_test_51Lv6iyAgVz7gSSKmxbVrhN83xXC60GQ6fo3ER0iuQuQbK4Typhzgq9UZgIQxRSpt1Noe2j1Af8r7jJU0EzjYcltJ00FJysUUsB'); // Reemplaza 'sk_test_tu_clave_secreta' con tu clave secreta de Stripe

app.use(express.json());

app.post('/crear-sesion-stripe', async (req, res) => {
  const { precio } = req.body;

  // Validación básica del precio
  if (!precio || typeof precio !== 'number' || precio <= 0) {
    return res.status(400).json({ error: 'Precio inválido' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Boleto de cine',
            },
            unit_amount: precio,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://tudominio.com/exito', // URL a la que redirigir después de un pago exitoso
      cancel_url: 'https://tudominio.com/cancelar', // URL a la que redirigir si se cancela el pago
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error al crear sesión de Stripe:', error);

    // Verifica si el error es un error de Stripe específico
    if (error.type === 'StripeError') {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).send('Error interno al crear sesión de Stripe');
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
