from datetime import datetime


def normalize_date(value):
    if not value:
        return None

    value = str(value).strip()

    formats = [
        "%Y-%m-%d",
        "%d-%m-%Y",
        "%d/%m/%Y",
        "%m/%d/%Y",
        "%B %d, %Y",
        "%b %d, %Y",
        "%d %B %Y",
        "%d %b %Y",
        "%B %d",
        "%b %d",
        "%d %B",
        "%d %b",
    ]

    for date_format in formats:
        try:
            parsed = datetime.strptime(value, date_format)

            # If year wasn't supplied, use current year
            if parsed.year == 1900:
                parsed = parsed.replace(year=datetime.now().year)

            return parsed.date()

        except ValueError:
            continue

    raise ValueError(
        f"Unable to understand date '{value}'. " f"Expected format such as YYYY-MM-DD."
    )
