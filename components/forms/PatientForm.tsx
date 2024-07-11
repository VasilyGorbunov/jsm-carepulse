"use client";

import React, {useState} from 'react';
import {z} from 'zod';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import CustomFormField from "@/components/CustomFormField";
import SubmitButton from "@/components/SubmitButton";
import {UserFormValidation} from "@/lib/validations";
import {useRouter} from "next/navigation";
import {createUser} from "@/lib/actions/patient.actions";

export enum FormFieldType {
    INPUT = 'input',
    TEXTAREA = 'textarea',
    PHONE_INPUT= 'phoneInput',
    CHECKBOX = 'checkbox',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton',
}



const PatientForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof UserFormValidation>>({
        resolver: zodResolver(UserFormValidation),
        defaultValues: {
            name: "",
            email: "",
            phone: ""
        }
    })


    async function onSubmit(values: z.infer<typeof UserFormValidation>) {
        setIsLoading(true)

        try {
            const user = {
                name: values.name,
                email: values.email,
                phone: values.phone,
            };
            const newUser = await createUser(user)
            console.log('USER', newUser)
            if (newUser) router.push(`/patients/${newUser.$id}/register`)
        } catch (error) {
            console.log(error)
        }
        setIsLoading(false)
    }


    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <section className="mb-12 space-y-4">
                        <h1 className="header">Hi there</h1>
                        <p className="text-dark-700">Schedule your first appointment.</p>
                    </section>

                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="name"
                        label="Full Name"
                        placeholder="John Doe"
                        iconSrc="/assets/icons/user.svg"
                        iconAlt="user"
                    />

                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="email"
                        label="Email"
                        placeholder="johndoe@app.com"
                        iconSrc="/assets/icons/email.svg"
                        iconAlt="email"
                    />

                    <CustomFormField
                        fieldType={FormFieldType.PHONE_INPUT}
                        control={form.control}
                        name="phone"
                        label="Phone number"
                        placeholder="(555) 555-5555"

                    />

                    <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
                </form>
            </Form>
        </>
    );
};

export default PatientForm;