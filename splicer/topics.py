import json
import csv

parent = '2P1 Mechanics'

topic_var = []
topic_dict = {}
# topics_list = []
topic_name = []
topic_prettyName = []
topic_description = []
topics = {}

year = []
questions_list = []
questions_dict = {}

output = {}

f = open('2p1.csv')
csv_f = csv.reader(f)

for row in csv_f:
    if csv_f.line_num in range(2,26):

        year.append(row[0])
        questions_list.append(row[1:])

    elif csv_f.line_num != 1:
        topic_var.append(row[0])
        topic_name.append(row[1])
        topic_description.append(row[2])


for i in range(len(year)):
    questions_dict[year[i]] = questions_list[i]

# print(topic_var)
# print(topic_name)
# print(topic_description)

for i in range(len(topic_var)):
    # print(topic_name[i])
    # print(topic_description[i])
    topics_list = []
    topics_list.append(topic_name[i])
    topics_list.append(topic_description[i])
    topics[topic_var[i]] = topics_list


print(topics)

output['Parent'] = parent
output['Topics'] = topics
output['Questions'] = questions_dict

print(output)

with open('test.json', 'w') as json_file:
    json.dump(output, json_file)

print(topic_name)

for name in topic_name:
    name = name.upper().replace(' ', '_').replace(',', ' ')

