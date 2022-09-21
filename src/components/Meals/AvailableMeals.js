import { useEffect, useState } from "react";
import classes from "./AvilableMeals.module.css";
import Card from "../UI/Card";
import MealItem from "./MealItem/MealItem";

const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState();
  useEffect(() => {
    //useeffect can't return a promise(cant use asynd here)
    const fetchMeals = async () => {
      const response = await fetch(
        "https://food-new-5a1ed-default-rtdb.firebaseio.com/Meals.json"
      );

      if (!response.ok) {
        throw new Error("Something went wrong!!"); //(message)
      }

      const responseData = await response.json();
      const loadedMeals = []; //creating empty array to put meals in it
      for (const key in responseData) {
        //creating loop to get into every item in responseData
        loadedMeals.push({
          id: key,
          name: responseData[key].name,
          description: responseData[key].description,
          price: responseData[key].price,
        });
      }
      setMeals(loadedMeals);
      setIsLoading(false);
    };

    fetchMeals().catch((error) => {
      setIsLoading(false);
      setHasError(error.message);
    }); //if error
  }, []); //without dependencies meals will load just once and wont change

  if (isLoading) {
    return (
      <section className={classes.MealsLoading}>
        <p>Loading...</p>
      </section>
    );
  }

  if (hasError) {
    return (
      <section className={classes.MealsError}>
        <p>{hasError}</p>
      </section>
    );
  }

  const mealsList = meals.map((meal) => (
    <MealItem
      id={meal.id} // this is new!
      key={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  return (
    <section className={classes.meals}>
      <Card>
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;
