from django.core.management.base import BaseCommand
from shop.models import Product
from PIL import Image, ImageDraw
import random
import os

# ==============================
# Product Templates
# ==============================

PRODUCT_DATA = {
    "Laptops": {
        "brands": ["HP", "Dell", "Lenovo", "ASUS", "Acer"],
        "models": ["Pavilion 15", "Inspiron 15", "LOQ 15", "TUF A15", "Nitro V"],
        "processors": ["Intel Core i5", "Intel Core i7", "Ryzen 5", "Ryzen 7"],
        "ram": ["8GB", "16GB", "32GB"],
        "storage": ["256GB SSD", "512GB SSD", "1TB SSD"],
        "price": (90000, 220000),
    },
    "Smartphones": {
        "brands": ["Samsung", "Apple", "Xiaomi", "Oppo", "Vivo"],
        "models": ["Galaxy A56", "iPhone 15", "Redmi Note 14", "Reno 13", "V40"],
        "ram": ["8GB", "12GB"],
        "storage": ["128GB", "256GB", "512GB"],
        "price": (35000, 280000),
    },
    "Books": {
        "publishers": ["Pearson", "O'Reilly", "Packt", "McGraw Hill"],
        "titles": [
            "Python Programming",
            "Clean Code",
            "Machine Learning Basics",
            "Algorithms",
            "Data Structures",
        ],
        "authors": [
            "Robert Martin",
            "James Clear",
            "Martin Fowler",
            "Andrew Ng",
            "John Smith",
        ],
        "price": (1200, 6000),
    },
    "Fashion": {
        "brands": ["Nike", "Adidas", "Puma", "Levis", "Zara"],
        "items": [
            "Running Jacket",
            "Hoodie",
            "T-Shirt",
            "Track Pants",
            "Jeans",
        ],
        "colors": ["Black", "White", "Blue", "Gray", "Red"],
        "price": (2000, 12000),
    },
    "Headphones": {
        "brands": ["Sony", "JBL", "Anker", "Beats", "Bose"],
        "models": ["SoundMax", "Bass Pro", "AirBeat", "Studio X", "Elite"],
        "price": (3000, 35000),
    },
    "Cameras": {
        "brands": ["Canon", "Nikon", "Sony", "Fujifilm"],
        "models": ["EOS 200D", "D5600", "Alpha A6400", "XT-30"],
        "price": (70000, 350000),
    },
    "Fitness": {
        "brands": ["Adidas", "Nike", "Everlast", "Reebok"],
        "items": [
            "Yoga Mat",
            "Dumbbell Set",
            "Resistance Bands",
            "Skipping Rope",
        ],
        "price": (1000, 15000),
    },
    "Automotive": {
        "brands": ["Toyota", "Honda", "Suzuki", "Kia"],
        "items": [
            "Car Cover",
            "Seat Cover",
            "Phone Holder",
            "Floor Mats",
        ],
        "price": (1500, 12000),
    },
}


# ==============================
# Placeholder Image
# ==============================


def create_placeholder(text, path):

    img = Image.new(
        "RGB",
        (500, 500),
        (
            random.randint(0, 255),
            random.randint(0, 255),
            random.randint(0, 255),
        ),
    )

    draw = ImageDraw.Draw(img)

    draw.text((50, 240), text[:20], fill="white")

    os.makedirs(os.path.dirname(path), exist_ok=True)

    img.save(path)


def generate_product(category):

    data = PRODUCT_DATA[category]

    if category == "Laptops":

        brand = random.choice(data["brands"])
        model = random.choice(data["models"])
        processor = random.choice(data["processors"])
        ram = random.choice(data["ram"])
        storage = random.choice(data["storage"])

        return {
            "brand": brand,
            "name": f"{brand} {model}",
            "price": random.randint(*data["price"]),
            "specifications": {
                "processor": processor,
                "ram": ram,
                "storage": storage,
            },
            "desc": f"{brand} {model} features {processor}, {ram} RAM and {storage}. Ideal for students, programming, office work and daily use.",
        }

    elif category == "Smartphones":

        brand = random.choice(data["brands"])
        model = random.choice(data["models"])

        ram = random.choice(data["ram"])
        storage = random.choice(data["storage"])

        return {
            "brand": brand,
            "name": f"{brand} {model}",
            "price": random.randint(*data["price"]),
            "specifications": {
                "ram": ram,
                "storage": storage,
            },
            "desc": f"{brand} {model} smartphone with {ram} RAM and {storage} storage. Suitable for photography, gaming and daily usage.",
        }

    elif category == "Books":

        publisher = random.choice(data["publishers"])
        title = random.choice(data["titles"])
        author = random.choice(data["authors"])

        return {
            "brand": publisher,
            "name": title,
            "price": random.randint(*data["price"]),
            "specifications": {
                "author": author,
                "publisher": publisher,
            },
            "desc": f"{title} written by {author}. Excellent resource for students and professionals.",
        }

    elif category == "Fashion":

        brand = random.choice(data["brands"])
        item = random.choice(data["items"])
        color = random.choice(data["colors"])

        return {
            "brand": brand,
            "name": f"{brand} {item}",
            "price": random.randint(*data["price"]),
            "specifications": {
                "color": color,
            },
            "desc": f"{brand} {item} in {color} color made with premium quality material for everyday comfort.",
        }

    elif category == "Headphones":

        brand = random.choice(data["brands"])
        model = random.choice(data["models"])

        return {
            "brand": brand,
            "name": f"{brand} {model}",
            "price": random.randint(*data["price"]),
            "specifications": {
                "type": "Wireless",
            },
            "desc": f"{brand} {model} wireless headphones with rich bass and crystal clear audio.",
        }

    elif category == "Cameras":

        brand = random.choice(data["brands"])
        model = random.choice(data["models"])

        return {
            "brand": brand,
            "name": f"{brand} {model}",
            "price": random.randint(*data["price"]),
            "specifications": {
                "sensor": "24 MP",
            },
            "desc": f"{brand} {model} DSLR camera delivering professional quality photos and videos.",
        }

    elif category == "Fitness":

        brand = random.choice(data["brands"])
        item = random.choice(data["items"])

        return {
            "brand": brand,
            "name": f"{brand} {item}",
            "price": random.randint(*data["price"]),
            "specifications": {},
            "desc": f"{brand} {item} designed for workouts and maintaining a healthy lifestyle.",
        }

    elif category == "Automotive":

        brand = random.choice(data["brands"])
        item = random.choice(data["items"])

        return {
            "brand": brand,
            "name": f"{brand} {item}",
            "price": random.randint(*data["price"]),
            "specifications": {},
            "desc": f"{brand} {item} made with durable materials to improve your driving experience.",
        }


# ==============================
# Seeder Command
# ==============================


class Command(BaseCommand):

    help = "Seed database with realistic products"

    def handle(self, *args, **kwargs):

        Product.objects.all().delete()

        categories = list(PRODUCT_DATA.keys())

        for i in range(100):

            category = random.choice(categories)

            product = generate_product(category)

            image_name = f"{category}_{i}.png"

            image_path = os.path.join(
                "media",
                "shop",
                "images",
                image_name,
            )

            create_placeholder(category, image_path)

            Product.objects.create(
                product_name=product["name"],
                brand=product["brand"],
                category=category,
                price=product["price"],
                desc=product["desc"],
                specifications=product["specifications"],
                image=f"shop/images/{image_name}",
            )

        self.stdout.write(
            self.style.SUCCESS("Successfully created 100 realistic products.")
        )
