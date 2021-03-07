import json
import csv

'''
'2P1_MECHANICS'
'2P2_STRUCTURES'
'2P3_MATERIALS'
'2P4_THERMOFLUID_MECHANICS'
'2P5_ELECTRICAL_ENGINEERING'
'2P6_INFORMATION_ENGINEERING'
'2P7_MATHEMATICAL_METHODS'
'''

parent = '2P7_MATHEMATICAL_METHODS'

topic_var = []
topic_name = []
topic_prettyName = []
topic_description = []
topics = {}

year = []
questions_list = []
questions_dict = {}

output = {}

f = open('2p7.csv')
csv_f = csv.reader(f)

for row in csv_f:
    if csv_f.line_num in range(2,26):

        year.append(row[0])
        questions_list.append(row[1:])

    elif csv_f.line_num != 1:
        topic_var.append(row[0])
        topic_prettyName.append(row[1])
        topic_description.append(row[2])

for i in range(len(year)):
    questions_dict[year[i]] = questions_list[i]

for name in topic_prettyName:
    name = name.upper().replace(' ', '_').replace(',', ' ')
    topic_name.append(name)

for i in range(len(topic_var)):
    # print(topic_name[i])
    # print(topic_description[i])
    topic_dict = {}
    topic_dict['name'] = topic_name[i]
    topic_dict['prettyName'] = topic_prettyName[i]
    topic_dict['description'] = topic_description[i]
    topics[topic_var[i]] = topic_dict

output['parent'] = parent
output['topics'] = topics
output['questions'] = questions_dict

with open('test.json', 'w') as json_file:
    json.dump(output, json_file)