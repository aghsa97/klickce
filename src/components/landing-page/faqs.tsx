import React from 'react'

import { faqs } from '@/app/config'

import { Button } from '../ui/button'
import * as Icon from '../icons'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'

function FAQs() {
    return (
        <div className='flex flex-col justify-center items-center gap-12 w-full border border-border rounded-lg p-6'>
            <div className='flex flex-col items-center justify-center gap-2'>
                <Button variant={'outline'} size="icon" className='w-16 h-16 rounded-full'>
                    <Icon.HelpingHand className='w-8 h-8' />
                </Button>
                <h2 className="text-xl md:text-3xl font-semibold text-center">
                    FAQs
                </h2>
            </div>
            <div className='w-full flex items-center'>
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger>{faq.question}</AccordionTrigger>
                            <AccordionContent>
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    )
}

export default FAQs