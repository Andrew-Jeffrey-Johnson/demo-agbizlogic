import pandas as pd
from parser import Parser
from categorizer import Categorizer

file0 = 'test_csv_files/Capstone 2022 data.xlsx'
file1 = 'test_csv_files/sample.csv'
file2 = 'test_csv_files/(alternate_values)farm_with_a_little_of_everything.xlsx'
file3 = 'test_csv_files/(extra_space)farm_with_a_little_of_everything.csv'
file4 = 'test_csv_files/(key)farm_with_a_little_of_everything.xlsx'
file5 = 'test_csv_files/(no_category)farm_with_a_little_of_everything.xlsx'
file6 = 'test_csv_files/(no_space)farm_with_a_little_of_everything.xlsx'
file7 = 'test_csv_files/(swapped_columns)farm_with_a_little_of_everything.xlsx'

# cat_name = 'Category' # file1, file3, file4, file6, file7
# cat_name = 'CaTeGoRy' # file2
cat_name = 'Tags' # file5
cat_name = cat_name.lower().title()
p = Parser(file1, cat_name)

p.run()

c = Categorizer()
c.extract_cat_name(cat_name, p.cat_dict)