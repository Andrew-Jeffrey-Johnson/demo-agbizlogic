import itertools

# Replace each character in string that matches deliminators with spaces
def words_of_string_as_list (string, delim):

    # Remove all punctuation with spaces
    for char in delim:
        string = string.replace(char, " ")
        
    # Remove trailing and leading whitespace and repeat whitespace
    output = " ".join(string.split())
    
    # Convert string to list of tags
    output = list(string.split(" "))
    
    while("" in output) :
        output.remove("")
    
    return output

# Strings received from sanitizer
tag = "Gas / Gasoline / Petrol / Petroleum / Fuel / Oil / Diesel"
tag1 = "Insurance / Car Insurance"

# Get each tag
tags = words_of_string_as_list(tag, """.,<>:;"'[]{}-=_+()*&^%$#@!~`\\|?/")""")
# Get all permutations of the tags
every_possible_tag = list(itertools.permutations(tags))

# Print results
print("These are all the tags")
print(tags)
print("\n")
print("These are all the permutations of the tags")
print(every_possible_tag)
print("\n")

# Make command-line wait for us
input("Press Enter to Exit")
