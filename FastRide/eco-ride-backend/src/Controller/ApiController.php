<?php
namespace App\Controller;

use App\Entity\User;
use App\Entity\Ride;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ApiController extends AbstractController
{
    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = new User();
        $user->setEmail($data['email']);
        $user->setPassword($data['password']);
        $user->setType($data['type']);
        $user->setName($data['name']);

        $em->persist($user);
        $em->flush();

        return $this->json([
            'message' => 'Inscription réussie',
            'token' => 'fake-jwt-token',
            'userType' => $user->getType(),
            'userName' => $user->getName()
        ]);
    }

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $em->getRepository(User::class)->findOneBy([
            'email' => $data['email'],
            'password' => $data['password'],
            'type' => $data['type']
        ]);

        if (!$user) {
            return $this->json(['error' => 'Identifiants incorrects'], 401);
        }

        return $this->json([
            'token' => 'fake-jwt-token',
            'userType' => $user->getType(),
            'userName' => $user->getName()
        ]);
    }

    #[Route('/api/rides', name: 'api_rides', methods: ['GET'])]
    public function getRides(EntityManagerInterface $em): JsonResponse
    {
        $rides = $em->getRepository(Ride::class)->findAll();

        $data = [];
        foreach ($rides as $ride) {
            $data[] = [
                'driver' => $ride->getDriver(),
                'seats' => $ride->getSeats(),
                'price' => $ride->getPrice(),
                'departure' => $ride->getDeparture(),
                'arrival' => $ride->getArrival(),
                'date' => $ride->getDate()->format('Y-m-d'),
                'eco' => $ride->isEco(),
            ];
        }

        return $this->json($data);
    }
}
