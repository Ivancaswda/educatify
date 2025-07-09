import Link from "next/link";
import CornerElements from "./CornerElements";
import { Button } from "./ui/button";
import { ArrowRightIcon } from "lucide-react";
import {useUser} from "@clerk/nextjs";
import {useQuery} from "convex/react";
import {api} from "../../convex/_generated/api";
import {useAuth} from "@/providers/authContext";
import LoaderUI from "@/components/LoaderUI";

const NoFitnessPlan = ({customer}) => {

    const {user} = useAuth()

    if (!customer) return


    console.log(customer)

    console.log(user)

  return customer?.role === 'student' ? (
    <div className="relative backdrop-blur-sm border border-border rounded-lg p-10 text-center">
      <CornerElements />

      <h2 className="text-2xl font-bold mb-4 font-mono">
          {customer._id === user?.id || customer.userId === user?.user_id  ? 'У вас пока нет посещаемых уроков' : 'У пользователя нет посещаемых уроков'}

      </h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto ">
            {customer._id === user?.id || customer.userId === user?.user_id ? 'Свяжитесь с вашим преподaвателем чтобы начать получать знания\n' +
                '             онлайн на платформе' : 'Предложите пользователю связаться с его преподaвателем чтобы начать получать знания\n' +
                '             онлайн на платформе'}
             <span
            className='text-primary font-semibold'> educatify</span>
        </p>
        <Button
            size="lg"
            asChild
            className="relative overflow-hidden bg-primary text-primary-foreground px-8 py-6 text-lg font-medium"
      >
        <Link href="/">
          <span className="relative flex items-center">
            Подключиться к уроку
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </span>
        </Link>
      </Button>
    </div>
  ) : (
      <div className="relative backdrop-blur-sm border border-border rounded-lg p-10 text-center">
          <CornerElements/>

          <h2 className="text-2xl font-bold mb-4 font-mono">
              {customer._id === user?.id ? 'Вы пока не провели' : 'Пользователь пока не провел'}  ни одного урока
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto ">
              {customer._id === user?.id ? 'Создайте мгновенный урок либо спланируйте его на будущее на' : 'Посоветуйте пользователю мгновенный урок либо спланировать его на будущее на'}
               <span
              className='text-primary font-semibold'> educatify</span>
          </p>
          <Button
              size="lg"
              asChild
              className="relative overflow-hidden bg-primary text-primary-foreground px-8 py-6 text-lg font-medium"
          >
              <Link href="/">
          <span className="relative flex items-center">
            Начать урок
            <ArrowRightIcon className="ml-2 h-5 w-5"/>
          </span>
              </Link>
          </Button>
      </div>
  )
};
export default NoFitnessPlan;
