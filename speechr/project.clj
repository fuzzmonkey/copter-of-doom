(defproject speechr "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :main speechr.core
  :resources ["lib"]
  :dependencies [[org.clojure/clojure "1.5.1"]
                 [clj-http "0.7.2"]
                 [com.cemerick/url "0.0.7"]
                 [org.clojure/data.json "0.2.2"]
                 [facts/speech-recognition "1.0.0"]
                 [edu.cmu.sphinx/sphinx4 "1.0-beta6"]])
