(ns speechr.core
  (:require [clojure.string :as string])
  (:import [edu.cmu.sphinx.frontend.util Microphone]
           [edu.cmu.sphinx.recognizer Recognizer]
           [edu.cmu.sphinx.result Result]
           [edu.cmu.sphinx.util.props ConfigurationManager])
  (:gen-class))

(defn get-text [recognizer]
  (loop []
    (let [result (some-> recognizer .recognize .getBestFinalResultNoFiller)]
      (if-not (string/blank? result)
        (println (str "you said: " result))
        (println "dude, wtf? Speak up!"))
      (recur))))

(defn -main []
  (let [config (ConfigurationManager. "config.xml")
        recognizer (.lookup config "recognizer")
        microphone (.lookup config "microphone")]
    (.allocate recognizer)
    (if-not (.startRecording microphone)
      (do
        (println "Cannot start microphone")
        (.deallocate recognizer))
      (do
        (println "listening for input")
        (get-text recognizer)))))

