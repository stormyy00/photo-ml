import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { QUESTIONS } from "@/data/faq";
import { Camera, Image, Zap } from "lucide-react";

const FAQ = () => {
  return (
    <div id="faq" className="min-h-screen py-16 px-4 bg-photo-white-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-6xl font-bold text-photo-green-300 mb-6">
            FAQ
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Frequently Asked Questions about Photo ML
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2">
            <div className="bg-photo-green-300 rounded-2xl overflow-hidden shadow-2xl">
              <Accordion type="single" collapsible className="space-y-0">
                {QUESTIONS.map(({ question, answer }, index) => (
                  <AccordionItem
                    value={question}
                    key={index}
                    className={`border-0 ${index !== QUESTIONS.length - 1 ? "border-b border-photo-green-300" : ""}`}
                  >
                    <AccordionTrigger className="px-8 py-6 text-left hover:no-underline group hover:bg-green-900/50 transition-all duration-300">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-green-900 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:bg-green-900 transition-colors">
                            {index + 1}
                          </div>
                          <span className="text-white font-semibold text-lg group-hover:text-teal-100 transition-colors">
                            {question}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-8 pb-6">
                      <div className="pl-14 text-photo-green-100 leading-relaxed text-base">
                        {answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="relative">
              <div className="absolute -inset-4 bg-photo-green-300/20 rounded-3xl blur-xl" />

              <div className="relative bg-white rounded-2xl p-8 shadow-2xl">
                <div className="text-2xl font-bold text-slate-800 mb-6 text-center">
                  See Photo ML in Action
                </div>
                <div className="relative h-80 mx-auto max-w-xs">
                  <div className="absolute top-8 left-4 w-48 h-56 bg-white rounded-lg shadow-xl transform rotate-12 hover:rotate-6 transition-transform duration-300 cursor-pointer">
                    <div className="p-3 h-full">
                      <div className="w-full h-36 bg-gradient-to-br from-slate-400 to-slate-600 rounded flex items-center justify-center mb-3 overflow-hidden">
                        <div className="relative w-full h-full flex items-center justify-center">
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-400/80 to-slate-600/80" />
                          <Camera className="w-12 h-12 text-white/90 z-10" />
                          <div className="absolute bottom-2 right-2 w-6 h-6 bg-white/20 rounded-full blur-sm" />
                          <div className="absolute top-3 left-3 w-4 h-4 bg-white/30 rounded-full blur-sm" />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-600">
                          Original
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-4 right-2 w-48 h-56 bg-white rounded-lg shadow-xl transform -rotate-6 hover:rotate-0 transition-transform duration-300 cursor-pointer">
                    <div className="p-3 h-full">
                      <div className="w-full h-36 bg-photo-green-300 rounded flex items-center justify-center mb-3 overflow-hidden">
                        <div className="relative w-full h-full flex items-center justify-center">
                          <div className="absolute inset-0 bg-gradient-to-br from-photo-green-300/80 to-teal-700/80"></div>
                          <Zap className="w-12 h-12 text-white/90 z-10" />
                          <div className="absolute top-2 right-3 w-8 h-8 bg-white/20 rounded-full blur-sm"></div>
                          <div className="absolute bottom-3 left-2 w-5 h-5 bg-white/30 rounded-full blur-sm"></div>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-600">
                          Enhanced
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-0 left-8 w-48 h-56 bg-white rounded-lg shadow-xl transform rotate-3 hover:-rotate-2 transition-transform duration-300 cursor-pointer z-10">
                    <div className="p-3 h-full">
                      <div className="w-full h-36 bg-gradient-to-br from-teal-600 to-teal-800 rounded flex items-center justify-center mb-3 overflow-hidden">
                        <div className="relative w-full h-full flex items-center justify-center">
                          <div className="absolute inset-0 bg-gradient-to-br from-photo-green-300 to-teal-800/80"></div>
                          <Image className="w-12 h-12 text-white/90 z-10" />
                          <div className="absolute top-4 left-4 w-6 h-6 bg-white/20 rounded-full blur-sm"></div>
                          <div className="absolute bottom-4 right-4 w-4 h-4 bg-white/30 rounded-full blur-sm"></div>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-600">
                          ML Magic ✨
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
