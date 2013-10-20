(ns speechr.core
  (:require [clojure.string :as string]
            [clj-http.client :as http])
  (:import [edu.cmu.sphinx.frontend.util Microphone]
           [edu.cmu.sphinx.recognizer Recognizer]
           [edu.cmu.sphinx.result Result]
           [edu.cmu.sphinx.util.props ConfigurationManager])
  (:gen-class))

(def node-server "http://localhost:3000/")

(defn send-command [cmd value]
  (http/post (str node-server "commands")
             {:form-params {:cmd cmd
                            :value value}}))

(def commands {"take off" ["takeoff" nil]
               "land" ["land" nil]
               "right" ["clockwise" 0.5]
               "down" ["down" 0.5]
               "up" ["up" 0.5]
               "left" ["counterClockwise" 0.5]
               "forwards" ["front" 0.1]
               "backwards" ["back" 0.1]
               "stop" ["stop" nil]})

(defn get-text [recognizer]
  (loop []
    (let [result (some-> recognizer .recognize .getBestFinalResultNoFiller)]
      (if-not (string/blank? result)
        (do
          (println (str "you said: " result))
          (apply send-command (get commands result)))
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

