from django.core.management.base import BaseCommand
from shop.models import Product
from faker import Faker
from PIL import Image, ImageDraw
import random
import os


fake = Faker()

CATEGORIES = [
    "Smartphones", "Laptops", "Gaming", "Headphones", "Smartwatches",
    "Cameras", "Books", "Fashion", "Shoes", "Beauty",
    "Furniture", "Home Appliances", "Sports", "Fitness",
    "Toys", "Automotive", "Jewelry", "Office", "Groceries", "Pet Supplies"
]


def create_placeholder(text, path):
    img = Image.new(
        "RGB",
        (500, 500),
        (
            random.randint(0, 255),
            random.randint(0, 255),
            random.randint(0, 255)
        )
    )

    draw = ImageDraw.Draw(img)
    draw.text((50, 250), text[:20], fill="white")

    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path)


class Command(BaseCommand):
    help = "Seed database with fake products"

    def handle(self, *args, **kwargs):

        Product.objects.all().delete()

        for i in range(1000):

            category = random.choice(CATEGORIES)

            image_name = f"{category}_{i}.png"

            image_path = os.path.join(
                "media",
                "shop",
                "images",
                image_name
            )

            create_placeholder(category, image_path)

            Product.objects.create(
                product_name=fake.company(),
                category=category,
                price=random.randint(500, 200000),
                desc=fake.text(max_nb_chars=400),
                image=f"shop/images/{image_name}"
            )

            if i % 100 == 0:
                self.stdout.write(f"{i} products created")

        self.stdout.write(self.style.SUCCESS("Done seeding products"))