# Stage 1: Build the app
FROM --platform=linux/amd64 gradle:8.4.0-jdk17 AS build
WORKDIR /app
COPY . .
RUN chmod +x ./gradlew
RUN ./gradlew build --no-daemon

# Stage 2: Create a minimal image to run the app
FROM --platform=linux/amd64 eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built JAR from the previous stage
COPY --from=build /app/build/quarkus-app/ /app/

# Expose the default Quarkus port
EXPOSE 8080

# Environment variable (optional)
ENV JAVA_OPTS="-Xms256m -Xmx512m"

# Run the app
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar quarkus-run.jar"]