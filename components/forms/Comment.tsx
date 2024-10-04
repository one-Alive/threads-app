"use client"
import * as z from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from '../ui/input';
import { usePathname, useRouter } from 'next/navigation';
import { CommentValidation } from '@/lib/validations/thread';
import { addComments } from '@/lib/actions/thread.actions';


interface Props {
    threadId: String,
    currentUserImg: String,
    currentUserId: string,
}
const Comment = ({ threadId, currentUserImg, currentUserId }: Props) => {

    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread: ''
        },
    });

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        await addComments(
            threadId,
            values.thread,
            JSON.parse(currentUserId),
            pathname,
        );
        
        form.reset();
    }

    return (

        <div>
            <Form {...form}>
                <form
                    className='comment-form'
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField
                        control={form.control}
                        name='thread'
                        render={({ field }) => (
                            <FormItem className='flex w-full items-center gap-3'>
                                <FormControl className='bg-transparent'>
                                    <Input
                                        type='text'
                                        placeholder='Comment...'
                                        className='no-focus text-light-1 outline-none'
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <Button type='submit'
                        className='comment-form_btn' title='Reply'>
                        Reply
                    </Button>
                </form>
            </Form>
        </div>
    )

}


export default Comment;