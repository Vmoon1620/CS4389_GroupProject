import csv
import datetime

def readCSVFile(file: str) -> list[str]:
    rows = []
    with open(file, "r") as csv_file:
        reader = csv.reader(csv_file)
        next(reader) # skip the header row
        for row in reader:
            if (len(row) > 0):
                rows.append(row)
    return rows

def insert(row: list[str], table: str) -> str:
    sql = "INSERT INTO " + table + " VALUES (" 
    for field in row:
        if field == row[len(row) - 1]:
            sql += ("\"" + field + "\"") # omit comma in final field
        else:
            sql += ("\"" + field + "\", ")
    return sql + (")\n")

def main() -> int:

    customers_rows = readCSVFile("Mock Data/customers_mock_data.csv")

    out_rows = []
    for customer in customers_rows:
        customerID = customer[0]
        fname = customer[1]
        lname = customer[2]
        # convert the date format to MySQL readable format
        dob = datetime.datetime.strptime(customer[3], "%m/%d/%Y").strftime("%Y-%m-%d")
        ssn = customer[4]

        row = [customerID, fname, lname, dob, ssn]
        out_rows.append(insert(row, "Customer"))
        
    with open("PopulateDBMS.sql", "w") as out:
        for row in out_rows:
            out.write(row)

    return 0

main()

