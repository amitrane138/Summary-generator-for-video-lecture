import speech_recognition as sr
import subprocess
import os
import ffmpeg
import spacy
from spacy.lang.en.stop_words import STOP_WORDS
import string
from heapq import nlargest
import webbrowser
#below is all for fastapi

from fastapi import FastAPI
from pydantic import BaseModel 
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


vidname = ''
class Video(BaseModel):
	url:str

@app.get("/")
def read_root():
	return{"key":"hello"}

@app.post("/addvideo")
def geturl(vurl:Video):
	vidname = str(vurl.url)
	print("hello : ",vurl)
	runn(vidname)
	print("process done, now sending back to website")
	return(vurl)
	
	


#end of fastapi 
#command = 'ffmpeg -i audio.wav -vn -ar 44100 -ac 2 -b:a 192k audio.mp3'
#subprocess.run(command)
def runn(vnamepassed):

	vname=str(vnamepassed)

	#1. command to convert video to audio
	command= 'ffmpeg -i '+vname+' output_audio.wav'
	subprocess.run(command)
	print("convertion from video to audio : DONE")

	#2. command to split audio to smaller audio files
	command= 'ffmpeg -i output_audio.wav -f segment -segment_time 95 -c copy output/%03d.wav'
	subprocess.run(command)
	print("splitting audio : DONE")
	print("The audio files are:")

	#3. read the split audio files from output folder and convert audio to text
	files=[]
	for filename in os.listdir('./output'):
		#print(filename)
		if filename.endswith(".wav"):
			files.append(filename)

	files.sort()		
	print(files)
	answer=" "
	for current_file in files:
		try:
			r = sr.Recognizer()

			audio_file = sr.AudioFile("./output/"+current_file)

			with audio_file as source:
				r.adjust_for_ambient_noise(source)
				audio = r.record(source)
			result = r.recognize_google(audio)
			answer+="\n"+result
			#print(result)
			print(current_file + " converted to text")
		except:
			continue	

	'''
	with open("opt.txt",mode ="w") as file:
			file.write("Recognized text:")
			file.write("\n")
			file.write(answer)'''

	print("\n Hurray! conversion is complete")



	#4. convert the text file stored in answer variable to summary

	stopwords = list(STOP_WORDS)

	nlp = spacy.load('en_core_web_sm')

	doc = nlp(answer)

	tokens = [token.text for token in doc]

	punctuation = string.punctuation

	punctuation = punctuation + '\n'

	word_frequencies = {}
	for word in doc:
		if word.text.lower() not in stopwords:
			if word.text.lower() not in punctuation:
				if word.text not in word_frequencies.keys():
					word_frequencies[word.text] = 1
				else:
					word_frequencies[word.text] += 1


	max_frequency = max(word_frequencies.values())

	for word in word_frequencies.keys():
		word_frequencies[word] = word_frequencies[word]/max_frequency

	sentence_tokens = [sent for sent in doc.sents]

	sentence_scores = {}
	for sent in sentence_tokens:
		for word in sent:
			if word.text.lower() in word_frequencies.keys():
				if sent not in sentence_scores.keys():
					sentence_scores[sent] = word_frequencies[word.text.lower()]
				else:
					sentence_scores[sent] += word_frequencies[word.text.lower()]


	select_length = int(len(sentence_tokens)*0.3)

	summary = nlargest(select_length, sentence_scores, key = sentence_scores.get)

	final_summary = [word.text for word in summary]
	summary = ' '.join(final_summary)


	print("summary generated successfully")
	#5. create a index.html to display the summary
	html_content = f"<html><head><h1>Summary : </h1></head><body><br><h2>{summary}</h2></body></html>"
	with open("index.html","w") as html_file:
		html_file.write(html_content)
		print("written successfully")
	webbrowser.open_new_tab("index.html")	



	#5.Write the final summary to opt.txt file

	with open("opt.txt",mode ="w") as file:
			file.write("Recognized text:")
			file.write("\n")
			file.write(answer)
			file.write("\n\n\n   **** THE SUMMARY IS ****\n")
			file.write(summary)

	#6. Delete all the temperory created audio's

	for filename in os.listdir('./output'):
		os.remove("output/"+filename)

	os.remove("output_audio.wav")	


	print("completed")	



