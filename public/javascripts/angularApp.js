var app = angular.module('huackerNews', ['ui.router']);

// Declare a posts service
app.factory('posts', function() {
    var o = {
        posts: [
            {
                title: 'German government to use Trojan spyware to monitor citizens', 
                upvotes: 3,
                comments: [
                    {author: 'Joe', body: 'Cool post!', upvotes: 0},
                    {author: 'Doe', body: 'Pff, horrible post.', upvotes: 1}
                ]
            },
            {
                title: 'Million Dollar Curve',
                upvotes: 5,
                comments: [
                    {author: 'Mark', body: 'Thank you', upvotes: 2},
                    {author: 'Bob', body: 'This is a comment.', upvotes: 0}
                ]
            }
        ]
    };
    return o;
});

app.controller('MainCtrl', [
'$scope',
'posts', // Injecting the service
function($scope, posts) {
    $scope.test = 'Hello World';
    $scope.posts = posts.posts;
    
    $scope.addPost = function() {
        if (!$scope.title || $scope.title === '') {
            return; 
        }
        $scope.posts.push({
            title: $scope.title,
            link: $scope.link,
            upvotes: 0,
            comments: [
                {author: 'Joe', body: 'Cool post!', upvotes: 0},
                {author: 'Doe', body: 'Pff, horrible post.', upvotes: 0}
            ]
        });
        $scope.title = '';
        $scope.link = '';
    };
    $scope.incrementUpvotes = function(post) {
        post.upvotes += 1;
    }  
}]);

app.controller('PostsCtrl', [
'$scope',
'$stateParams',
'posts',
function($scope, $stateParams, posts) {  
    $scope.post = posts.posts[$stateParams.id];

    $scope.addComment = function() {
        if ($scope.body === '') {
            return;
        }
        $scope.post.comments.push({
            author: 'user',
            body: $scope.body,
            upvotes: 0
        });
        $scope.body = '';
    }
}]);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/index.html',
            controller: 'MainCtrl'
        })
        .state('posts', {
            url: '/posts/{id}',
            templateUrl: '/posts.html',
            controller: 'PostsCtrl'
        });

        $urlRouterProvider.otherwise('home');
    }
]);
